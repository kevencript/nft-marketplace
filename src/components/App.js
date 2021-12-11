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
        if(!await this.isWalletConnected()) return
        
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.getId()
        const networkData = Brazukas.networks[networkId]

        this.setState({
            account: accounts[0],
        })

        if(networkData) {
            const abi = Brazukas.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            this.setState({ contract })
        } else {
            window.alert("SmartContract not deployed")
        }
        
        const totalSupply = await this.state.contract.methods.totalSupply().call()

        for(let i=0; i < totalSupply; i++) {
            const brazuka = await this.state.contract.methods.BrazukasArray(i).call()
            this.setState({
                brazukas: [...this.state.brazukas, brazuka]
            })
        }

        console.log(this.state)
    }

    async isWalletConnected(){
        return this.state.isWalletConnected
    }

    mint = async (brazuka) => {
        await this.state.contract.methods.mint(brazuka).send({
            from: this.state.account
        }).once('receipt', (receipt) => {
            this.setState({
                brazukas: [...this.state.brazukas, brazuka]
            })
        })
    }

    constructor(props){
        super(props)
        this.state = {
            account: '',
            isWalletConnected: false,
            totalSupply: 0,
            contract: null,
            brazukas: []
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
