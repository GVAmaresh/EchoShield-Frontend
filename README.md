
# EchoShield

EchoShield is a comprehensive system that detects whether an audio file is human or AI-generated, analyzes its authenticity, and ensures the data's immutability through blockchain integration.


**This project is divided into two parts:**

1. **Frontend**: Responsible for the user interface and interaction, developed using React and TypeScript, with blockchain integration for minting NFTs and ensuring data immutability.
2. **Backend**: Handles backend processing, model training, and feature extraction, developed using Python (FastAPI, TensorFlow).

Each part is managed in a separate repository for better organization and maintenance.

**Please start with the Backend Repository first, followed by the Frontend Repository**.

- **Backend Repository**: [GitHub Link](your-backend-repository-link)
- **Frontend Repository**: [GitHub Link](your-frontend-repository-link)


## Table of Contents

1. [Demo](#demo)
2. [Technology Used](#technology-used)
3. [Description](#description)
4. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    2. [Using CMD (Command Line)](#using-cmd-command-line)
    3. [Using Docker](#using-docker)
5. [Meet the Team](#meet-the-team)
6. [Benefits](#benefits)
7. [License](#license)

## Demo
## Technology Used

**Programming & Scripting Languages:**
- **Python**: For backend processing, model training, and feature extraction.
- **JavaScript**: For interactive frontend design and backend logic.
- **TypeScript**: Ensures type safety and robustness in the React components.

**Frameworks & Libraries:**
- **React**: Frontend framework for building user interfaces.
- **FastAPI**: Lightweight Python framework for serving the backend.
- **Hugging Face Transformers**: For integrating pre-trained models like wav2vec.

**Audio Processing:**
- **FFmpeg**: For audio conversion and preprocessing tasks.

**Machine Learning:**
- **TensorFlow**: Used for model implementation and training, focusing on deep learning for audio detection.
- **Model Architecture**: Sequential model with Conv2D for feature extraction, MaxPooling2D for downsampling, dense layers with ReLU, dropout for regularization, and softmax output.

**Ethereum:**
- For minting NFTs and ensuring data immutability.

**Other Tools:**
- **IPFS (InterPlanetary File System)**: To store audio files securely and immutably.


## Description

 * **Audio Detection**
EchoShield analyzes whether audio is human or AI-generated using advanced models like wav2vec, Melody Machine, and VGG16.

 * **Deepfake Detection**
The system uses feature extraction and entropy calculations to identify deepfake audio.

 * **Entropy Calculation**
EchoShield measures the unpredictability or randomness in the audio to assess its authenticity and determine its likelihood of being a deepfake.

 * **Metadata Creation**
The deepfake status, entropy value, and IPFS hash of the audio are compiled into metadata, providing a comprehensive overview of the audio's characteristics.

 * **IPFS Storage**
The audio file is securely stored on the IPFS network, providing a unique, decentralized identifier for each file.

 * **NFT Minting**
The metadata, including deepfake status, entropy, and IPFS hash, is minted as a non-fungible token (NFT) on the Ethereum blockchain.

 * **Immutability & Verification**
The minted NFT ensures that the audio and its associated data are immutable, verifiable, and securely linked to the blockchain, providing a trustworthy and transparent verification system.

    

## Getting Started

**Prerequisites**

Before getting started, make sure you have the following installed and set up:

**Git**

Ensure that **Git** is installed and that you are logged in to GitHub.

Check if Git is installed:
```bash
git --version
```

If Git is not installed, download and install it from the official Git website:

- Download Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
Git Documentation:
- Git Docs: https://git-scm.com/doc[https://git-scm.com/doc](https://git-scm.com/doc)


**Docker**

Ensure that Docker is installed on your machine if you plan to use Docker for running the project.

Check if Docker is installed:
```bash
docker --version
```

If Docker is not installed, download and install it from the official Docker website:

- Download Docker: https://www.docker.com/products/docker-desktop
[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
Docker Documentation:
- Docker Docs: [https://docs.docker.com/](https://docs.docker.com/)

**Using CMD (Command Line)**

First, clone the frontend and backend repositories using the following commands:

```bash
git clone https://github.com/GVAmaresh/EchoShield-Frontend.git
```

Navigate into the project directory and install the necessary dependencies.

```bash
cd EchoShield-Frontend
npm install

```
Once the installation is complete, you can start the frontend by running:

```bash
npm start
```
Now you should be able to access the frontend on [http://localhost:3000](http://localhost:3000)

**Using Docker**

First, clone the frontend and backend repositories using the following commands:

```bash
git clone https://github.com/GVAmaresh/EchoShield-Frontend.git
```

To build the Docker images, first navigate into the projectand then build the Docker images

```bash
cd EchoShield-Frontend
docker build -t echoshield-frontend .

```
After building the images, you can verify that they were created successfully using:
```bash
docker images
```

After building the images, run the containers for frontend
```bash
docker run -d -p 3000:3000 echoshield-frontend
```

Now you should be able to access the frontend on [http://localhost:3000](http://localhost:3000)





## Meet the Team

- **G V Amaresh**: [GVAmaresh ](https://github.com/GVAmaresh)
- **Prateek Savanur**: [PrateekSavanur](https://github.com/PrateekSavanur)
- **Chinmayee G**: [Chi-nm](https://github.com/Chi-nm)
- **Charu Bohra**: [CharuBohra](https://github.com/CharuBohra)

## Benefits
- Accurate deepfake detection using state-of-the-art models.
- Secure and decentralized storage using IPFS.
- Immutable verification through blockchain technology.
- Provides transparent and verifiable metadata for each audio file.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/GVAmaresh/EchoShield-Frontend/blob/main/LICENSE) file for details.
