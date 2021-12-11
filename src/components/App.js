import React, { Component } from "react"
import './App.css';
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider";
import Brazukas from "../abis/Brazukas.json"

class App extends Component {

    async componentDidMount(){
        await this.loadWeb3()
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider()
        if(provider) {
            console.log("Ethereum wallet is connected!")
            window.web3 = new Web3(provider)
        } else {
            console.log("No Ethereum wallet connected.")
        }
    }

    render() {
        return(
            <div>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }  
}   

export default App
