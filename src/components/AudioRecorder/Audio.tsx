import  { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../App";
import { pinata } from "../../web3helpers/pinataConfig";
import { abi } from "../../web3helpers/abi";
import { FaDownload } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa6";
import { ethers } from "ethers";
import { FaRegCheckCircle } from "react-icons/fa";
import { Alert, TextField } from "@mui/material";
import { RiContractFill } from "react-icons/ri";
import WaveSurfer from "wavesurfer.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";

interface AudioProps {
  audioSrc: File | undefined;
  prediction?: string;
  entropy?: string;
  text?: string;
}
interface IMeta {
  name: string;
  description: string;
  audioIpfsUrl: string;
}

const OutputAudio = ({ audioSrc, prediction, entropy, text }: AudioProps) => {
  // const [amplitude, setAmplitude] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [audioIPFS, setAudioIPFS] = useState<string | null>(null);
  const [tokenURI, setTokenURI] = useState<string | undefined>("");
  const [alert, setAlert] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  // const [errorMesage, setErrorMessage] = useState<string | null>(null);
  const { walletAdd, setWalletAdd } = useAppContext();

  const [metadata, setMetadata] = useState<IMeta>({
    name: "",
    description: "",
    audioIpfsUrl: ""
  });
  const contractAddress = "0xdE8FB58EDDcDD57156c003800f15dA6004Ea6e58";

  useEffect(() => {
    if (audioSrc) {
      const url = URL.createObjectURL(audioSrc);
      setAudioUrl(url);
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioSrc, audioUrl]);

  useEffect(() => {
    if (!audioSrc) return;
    audioRef.current?.pause();
    const audioUrl = URL.createObjectURL(audioSrc);
    audioRef.current = new Audio(audioUrl);
    return () => {
      audioRef.current?.pause();
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioSrc]);

  useEffect(() => {
    if (!audioUrl) return;

    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyserRef.current = analyser;

    try {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;

      source.connect(analyser);
      analyser.connect(audioContext.destination);
      audioElement.addEventListener("play", async () => {
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        updateAmplitude();
      });

      const updateAmplitude = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        const sum = dataArray.reduce((acc, value) => acc + value, 0);
        const average = sum / dataArray.length;

        // setAmplitude(average);
        requestAnimationFrame(updateAmplitude);
      };
    } catch (error) {
      console.error("Error connecting MediaElementSourceNode:", error);
    }

    return () => {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioUrl, audioUrl]);

  // const playAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play();
  //     // setIsPlaying(true);
  //   }
  // };

  // const pauseAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     // setIsPlaying(false);
  //   }
  // };
  console.log("Check the prediction: ",prediction)

  const handleClick = (buttonId: string, action: () => void) => {
    setActiveButton(buttonId);
    console.log(buttonId);
    action();
    setTimeout(() => setActiveButton(null), 200);
  };

  window.addEventListener("unhandledrejection", (event) => {
    console.warn("Unhandled promise rejection:", event.reason);
    if (event.reason.isHandled){
console.log("Dont handle this one")
      return;
    }
    if (event.reason && event.reason.code === 4001) {
      // setErrorMessage("Transaction rejected by the user.");
      WarningTimer("Transaction Rejected");
      event.reason.isHandled = true;
      return;
    } else {
      // setErrorMessage("An unexpected error occurred.");
      WarningTimer("An unexpected error occurred.");
      event.reason.isHandled = true;
      return;
  }
 
  });

  const writeContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let add;
      if(!walletAdd){
        add = await signer.getAddress()
        setWalletAdd(add);
      }
      const newAdd = walletAdd || add
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log("Wallet Adress = ", newAdd);
      console.log("AudioIPFs = ", audioIPFS);
      await contract.mintNFT(newAdd, tokenURI);
      
    } catch (err: any) {
      console.log("Error: ==", err);
      WarningTimer("Transaction Rejected");
      err.isHandled = true
    }
  };

  const uploadMetaData = async () => {
    const nftMetadata = {
      name: metadata.name,
      description: metadata.description,
      audio: `https://ipfs.io/ipfs/${audioIPFS}`,
      attributes: [
        {
          trait_type: "Authenticity",
          value: entropy !== null && Number(entropy) > 150 ? "True" : "False"
        },
        {
          trait_type: "Entropy",
          value: Number(entropy).toFixed(3)
        }
      ]
    };
    try {
      console.log("Uploading nftMetadata: ", nftMetadata);
      const token = await pinata.upload.json(nftMetadata);
      console.log("Pinata token URI = ", token);
      if (!token) return;
      setTokenURI(token.IpfsHash);
      alertTimer("Uploaded Token URI To Pinata");
    } catch (err) {
      console.log(err);
    }
  };

  const uploadToIPFS = async () => {
    try {
      if (!audioSrc) {
        console.log("No audio file selected");
        return;
      }
      console.log("Uploading to IPFS");
      const upload = await pinata.upload.file(audioSrc);
      console.log("Upload.ipfs = ", upload.IpfsHash);
      setAudioIPFS(upload.IpfsHash);
      alertTimer("Uploaded Audio To IPFS");
    } catch (err) {
      console.log(err);
    }
  };

  const defaultShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
  const activeShadow =
    "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset";
  function getRandomHumanVoiceMessage(): string {
    const messages = [
      "This is the voice of a human.",
      "The voice belongs to a person.",
      "It is a voice generated by a human.",
      "This sound is human-made.",
      "A human is speaking.",
      "The source of this voice is a person.",
      "This is a real human's voice.",
      "The voice originates from a human.",
      "A person is producing this voice.",
      "This is an authentic human voice."
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }
  function getRandomAIGeneratedVoiceMessage(): string {
    const messages = [
      "This is a voice created by AI.",
      "The voice is synthesized using artificial intelligence.",
      "It is a machine-generated voice.",
      "This sound is produced by AI technology.",
      "An AI system created this voice.",
      "The voice originates from an artificial intelligence model.",
      "This is an AI-synthesized voice.",
      "The voice is generated by a computer program.",
      "This sound is artificial and created by AI.",
      "It is a voice generated through AI algorithms."
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }
  const entropyDisplay = (entropy: number) => {
    if (entropy < 300) {
      return (
        <div className="">
          <div className="">
            Entropy value:{" "}
            <span className=" font-bold">{entropy.toFixed(3)}</span>
          </div>
          <div className="">
            Interpretation: Low entropy indicates high certainty in predictions.
          </div>
        </div>
      );
    } else if (150 <= entropy && entropy <= 550) {
      return (
        <div className="">
          <div className="">
            Entropy value:{" "}
            <span className=" font-bold">{entropy.toFixed(3)}</span>
          </div>
          <div className="">
            Interpretation: Moderate entropy suggests some uncertainty in
            predictions.
          </div>
        </div>
      );
    } else {
      return (
        <div className="">
          <div className="">
            Entropy value:{" "}
            <span className=" font-bold">{entropy.toFixed(3)}</span>
          </div>
          <div className="">
            Interpretation: High entropy indicates significant uncertainty in
            predictions.
          </div>
        </div>
      );
    }
  };
  const waveformRef = useRef(null); // For the waveform container
  const spectrogramRef = useRef(null); // For the spectrogram container
  const waveSurferRef = useRef(null); // To store WaveSurfer instance

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    // Initialize WaveSurfer
    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url: audioUrl,
      sampleRate: 22050
    });

    // Initialize Spectrogram plugin
    waveSurfer.registerPlugin(
      Spectrogram.create({
        container: spectrogramRef.current,
        labels: true,
        height: 200,
        splitChannels: true
      })
    );
    waveSurfer.on("interaction", () => {
      waveSurfer.play();
      // setIsPlaying(true);
    });

    waveSurfer.on("finish", () => {
      // setIsPlaying(false);
    });

    waveSurfer.once("interaction", () => waveSurfer.play());

    if (!waveSurfer) waveSurferRef.current = waveSurfer;

    return () => {
      waveSurfer.destroy();
    };
  }, [audioUrl]);
  const humanSentence = getRandomHumanVoiceMessage();
  const aIGeneratedSentence = getRandomAIGeneratedVoiceMessage();

  const alertTimer = (s: string) => {
    setAlert(s);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const WarningTimer = (s: string) => {
    setWarning(s);
    setTimeout(() => {
      setWarning(null);
    }, 3000);
  };

  return (
    <div className="h-96">
      {audioUrl && (
        <div className="">
          <div className="absolute ml-4 mt-2 z-40">
            {alert && <Alert severity="success">{alert}</Alert>}
          </div>
          <div className="absolute ml-4 mt-2 z-40">
            {warning && <Alert severity="warning">{warning}</Alert>}
          </div>

          <div className="mx-32">
            <div
              id="waveform"
              className=" mb-4"
              ref={waveformRef}
              style={{ marginBottom: "20px" }}
            ></div>
            <div id="spectrogram" ref={spectrogramRef}></div>
          </div>

          <div className=" flex justify-center gap-4 mt-4">
            {/* <div
              className="rounded-full p-4 cursor-pointer"
              onClick={() =>
                handleClick("play_pause", () => {
                  console.log("Revert action triggered");
                })
              }
              style={{
                boxShadow:
                  activeButton === "play_pause" ? activeShadow : defaultShadow
              }}
            >
              {isPlaying ? (
                <div className="pause" onClick={pauseAudio}>
                  <FaPause size={20} />
                </div>
              ) : (
                <div className="play" onClick={playAudio}>
                  <FaGooglePlay size={20} />
                </div>
              )}
            </div> */}
            <div className="mt-6">
              <div
                className="rounded-full p-4 cursor-pointer"
                style={{
                  boxShadow:
                    activeButton === "download" ? activeShadow : defaultShadow
                }}
                onClick={() => {
                  console.log("Download");
                  const link = document.createElement("a");
                  link.href = audioUrl;
                  link.download = "audio_file.wav";
                  document.body.appendChild(link);
                  link.click();
                  handleClick("download", () => {
                    console.log("Revert action triggered");
                  });
                  document.body.removeChild(link);
                }}
              >
                <FaDownload size={20} />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div className="w-fit border-2 border-gray-300 shadow-lg rounded-xl mx-12 px-6 py-4 bg-white">
              {prediction && (
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {/* {entropy !== null && Number(entropy) > 150
                      ? humanSentence
                      : aIGeneratedSentence} */}
                      {
                        prediction &&  prediction  === "REAL" ? humanSentence:aIGeneratedSentence
                      }
                  </h3>
                </div>
              )}
              <div className="text-center mb-2">
                {entropy && (
                  <div className="text-gray-500 text-sm">
                    {entropyDisplay(Number(entropy))}
                  </div>
                )}
              </div>

              {text && (
                <div className="text-center">
                  <p className="text-gray-700 font-medium">
                    Text: <span className="text-gray-900">{text}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className=" flex justify-center mt-6 gap-2">
            <div className="">
              <div className=" flex gap-2">
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    defaultValue={metadata.name}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    defaultValue={metadata.description}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                  />
                </div>
              </div>
              <div className=" flex justify-evenly mt-4">
                <div
                  className="rounded-full p-4 cursor-pointer"
                  onClick={() => {
                    handleClick("ipfs", () => {
                      console.log("upload action triggered");
                    });
                    uploadToIPFS();
                  }}
                  style={{
                    boxShadow:
                      activeButton === "ipfs" ? activeShadow : defaultShadow
                  }}
                >
                  <FaRegCheckCircle size={20} />
                </div>
                <div className="">
                  {metadata.name && metadata.description ? (
                    <div
                      className="rounded-full p-4 cursor-pointer"
                      onClick={() => {
                        handleClick("upload", () => {
                          console.log("upload action triggered");
                        });
                        uploadMetaData();
                      }}
                      style={{
                        boxShadow:
                          activeButton === "upload"
                            ? activeShadow
                            : defaultShadow
                      }}
                    >
                      <FaUpload size={20} />
                    </div>
                  ) : (
                    <div
                      className="rounded-full p-4 cursor-not-allowed"
                      style={{
                        boxShadow: defaultShadow
                      }}
                    >
                      <FaUpload size={20} className=" text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="">
                  <div
                    className="rounded-full p-4 cursor-pointer"
                    onClick={() => {
                      handleClick("contract", () => {
                        console.log("upload action triggered");
                      });
                      writeContract();
                    }}
                    style={{
                      boxShadow:
                        activeButton === "contract"
                          ? activeShadow
                          : defaultShadow
                    }}
                  >
                    <RiContractFill size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="mt-2">
              {audioIPFS && (
                <a
                  href={`https://fuchsia-shivering-sparrow-317.mypinata.cloud/ipfs/${audioIPFS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:font-semibold"
                >
                  Audio IPFS: https://ipfs.io/ipfs/{audioIPFS}
                </a>
              )}
            </div>
            <div className="text-md font-normal text-gray-700">
              {tokenURI && (
                <a
                  href={`https://fuchsia-shivering-sparrow-317.mypinata.cloud/ipfs/${tokenURI}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:font-semibold"
                >
                  Token URI: https://ipfs.io/ipfs/{tokenURI}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputAudio;
