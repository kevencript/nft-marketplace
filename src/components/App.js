import React, { Component } from "react"
import './App.css';
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider";
import Brazukas from "../abis/Brazukas.json"

class App extends Component {

    async componentDidMount(){
        await this.loadWeb3()
        await this.loadBlochainData()
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider()
        if(provider) {
            console.log("Ethereum wallet is connected!")
            window.web3 = new Web3(provider)
            this.setState({ isWalletConnected: true })
        } else {
            console.log("No Ethereum wallet connected.")
        }
    }

    async loadBlochainData(){
        const web3 = window.web3
        const walletIsConnected = await this.checkIfWalletIsConnected()
        const networkId = await web3.eth.getId()
        const networkData = Brazukas.networks[networkId]
        
        if(walletIsConnected) {
            const accounts = await web3.eth.getAccounts()
            this.setState({
                account: accounts,
            })
        }

        if(networkData) {
            const abi = Brazukas.abi
            const address = networkData
            const contract = new web3.eth.Contract(abi, address)
            this.setState({ networkData, contract })
        }
        
        console.log(this.state)
    }

    async checkIfWalletIsConnected(){
        return this.state.isWalletConnected
    }

    constructor(props){
        super(props)
        this.state = {
            account: '',
            isWalletConnected: false,
            networkData: '',
            contract: ''
        }
    }

    render() {
        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">NFT Marketplace</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Home<span className="sr-only">(current)</span></a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">Features</a>
                            </li>
                            
                            <li className="nav-item">
                                <a className="nav-link" href="#">Pricing</a>
                            </li>
                        </ul>
                        <span className="navbar-text">
                            {this.state.account}
                        </span>
                    </div>
                </nav>

                <h1>We are Doing a log!</h1>
            </div>
        )
    }  
}   

export default App
