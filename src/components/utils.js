import Brazukas from "../abis/Brazukas.json"
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

 

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const address = await window.ethereum.enable() 
            const obj = {
                connectedStatus:true,
                status:"",
                address: address
            }
            return obj;
        } catch (error) {
            return {
                connectedStatus: false,
                status: "🦊 Connect to Metamask using the button on the top right"
            }
        }
    } else {
        return {
            connectedStatus: false,
            status: "🦊  You must install Metamask into your browser: https://metamask.io/download.html"
        }
    }
};

export const mintNFT = async (nftPath, address) => {
    let objectResponse 

    await window.contract.methods.mint(nftPath).send({
        from: address
    }, (error, hash) => {
        if(error) {
            objectResponse = {
                success: false,
                status: '😥 Something went wrong: ' + error.message
            }
        } else {
            objectResponse = {
                success: true,
                status: "✅ NFT Successfully Minted. Hx: "+hash
            }
        }   
    })

    return objectResponse
}

export const loadContract = async () => {
    const provider = await detectEthereumProvider()
    const web3 = new Web3(provider) 
    const networkId   = await web3.eth.net.getId()
    const networkData = Brazukas.networks[networkId]

    if(networkData) {
        const contractABI = Brazukas.abi
        const contractAddress = networkData.address
        window.contract = new web3.eth.Contract(contractABI, contractAddress);

        return {
            success: true,
            status: ''
        }
    } else {
        return {
            success: false,
            status: 'SmartContract not deployed'
        }
    }

}

