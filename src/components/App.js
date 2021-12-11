import React, { Component } from "react"
import './App.css';
import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider";
import Brazukas from "../abis/Brazukas.json"

class App extends Component {
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
        if(!await this.isWalletConnected()) {
            alert("🦊 MetaMask must be connected to this functionality works!")
            return
        } 
        
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
        if(!this.state.account) {
            alert("You can't mint without been logged on MetaMask 🦊")
            return
        }

        const callback = await this.state.contract.methods.mint(brazuka).send({
            from: this.state.account
        }, (error, hash) => {
            if(!error) {
                alert("NFT '"+brazuka+"' successfully minted!")
                this.setState({
                    brazukas: [...this.state.brazukas, brazuka]
                })
            }

            
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const brazuka = this.brazuka.value
        this.mint(brazuka)
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
                            <a>
                                { this.state.account ? this.state.account : "Connect MetaMask 🦊"}
                            </a>
                        </span>
                    </div>
                </nav>

                <div className="containers mt-5">

                    <div className="row">
                        <div className="col-12 center-block">
                            <center>    
                                <h1 className="mb-2">Mint New NFT</h1>
                                <form className="col-md-8 col-lg-6 text-left" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">NFT Path:</label>
                                        <input ref={(input) => {
                                            this.brazuka = input
                                        }} type="text" className="form-control" id="nftPath" aria-describedby="nftHelper" placeholder="Add the file location (Ex: /files/Brazukas)"></input>
                                        <small id="emailHelp" className="form-text text-muted text-center"> Metamesk must be connected for minting new NFT's</small>
                                    </div>

                                    <center>
                                        <button type="submit" className="btn btn-primary col-md-7 col-sm-12" disabled={!this.state.account} >
                                            { this.state.account ? "Submit " : "Submit (🦊 Metamask not connected)" }
                                        </button>
                                    </center>


                                </form>
                            </center>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12 center-block">
                            <center>    
                                <h1 className="mb-2">Get NFT's list</h1>

                                <button type="text" onClick={async (event) => {
                                    event.preventDefault() 
                                    console.log(this.state.brazukas)
                                }} className="btn btn-primary col-3" disabled={!this.state.account}>
                                     { this.state.account ? "Get List " : "Get List (🦊 Metamask not connected)" }
                                </button>

                            </center>
                        </div>
                    </div>
                </div>

            </div>
        )
    }  
}   

export default App
