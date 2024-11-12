import { useState } from "react";
import DeepfakeDetection from '../DeepFakeDetection/DeepFakeDetection'; 
import DeepfakeAudio from '../DeepFakeAudio/DeepFakeAudio';

export default function MainBody() {
    const [nav, setNav] = useState<string[]>([
        "Deepfake Detection", 
        "Deepfake Audio", 
    ]);
    const [activeContent, setActiveContent] = useState<number>(0);

    const handleSetActiveContent = (idx: number) => {
        setActiveContent(idx);
    };

    return (
        <div className="">
            <div className="flex justify-center">
                <nav className="flex items-center space-x-4">
                    {nav.map((item, idx) => (
                        <button
                            key={idx}
                            className={`text-sm md:text-xl  ${activeContent === idx ? " font-extrabold" : "font-medium"} `}
                            onClick={() => handleSetActiveContent(idx)}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="">
                {activeContent === 0 && <DeepfakeDetection />}
                {activeContent === 1 && <DeepfakeAudio />}
            </div>
        </div>
    );
}

