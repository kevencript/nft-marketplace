import './Minter.css';
import React, { useEffect, useState } from "react"
import { connectWallet, mintNFT, loadContract } from '../utils'


const Minter = () => {
    // Global States
    const [isConnected, setConnectedStatus] = useState(false)
    const [walletAddress, setWallet] = useState('')
    const [status, setStatus] = useState('')
    const [isContractLoaded, setContractIsLoaded] = useState(false)

    // Form input
    const [nftPathToMint, setNftPathToMint] = useState('')

    useEffect(async () => {
        if (window.ethereum) { // if Metamask installed
            if(!isContractLoaded) { // verifying/loading contract
                const contractResponse = await loadContract()
                setStatus(contractResponse.status)
                setContractIsLoaded(contractResponse.success)
            }

            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" }) //get Metamask wallet
                if (accounts.length) { //if a Metamask account is connected
                    setConnectedStatus(true);
                    setWallet(accounts[0]);
                } else {
                    setConnectedStatus(false);
                    setStatus("🦊 Connect to Metamask using the top right button.");
                }
            } catch {
                setConnectedStatus(false);
                setStatus(
                    "🦊 Connect to Metamask using the top right button. " +
                    walletAddress
                );
            }
        }
    })
    
    const mintPressed = async (e) => {
        e.preventDefault() 
        if(nftPathToMint === '') return
        console.log(nftPathToMint)
        const mintResponse = await mintNFT(nftPathToMint, walletAddress)
        if(mintResponse.success) {
            setStatus(mintResponse.status)
        }
    }

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet()
        setConnectedStatus(walletResponse.connectedStatus)
        setStatus(walletResponse.status)
        if(isConnected) {
            setWallet(walletResponse.address)
        }
    }

    return (
    <div className="Minter">
        <div className='container-fluid'>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">NFT Marketplace</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Mint NFT</a>
                        </li>

                        {/* <li className="nav-item">
                            <a className="nav-link" href="#">Features</a>
                        </li>
                        
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                        </li> */}
                    </ul>
                    <span className="navbar-text float-right">
                        { walletAddress ? 
                            <a>
                                { walletAddress }
                            </a>
                        : 
                            <a onClick={connectWalletPressed} style={{ cursor: 'pointer' }}>
                                Connect MetaMask 🦊
                            </a>
                            
                        }
                        
                    </span>
                </div>
            </nav>
        </div>
            <div className="containers mt-5">

                <div className="row">
                    <div className="col-12 center-block">
                        <center>    
                            <h1 className="mb-2">Mint New NFT</h1>
                            <form className="col-md-8 col-lg-6 text-left" >
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">NFT Path:</label>
                                    <input onChange={(e) => {
                                        setNftPathToMint(e.target.value)
                                    }} type="text" className="form-control" id="nftPath" aria-describedby="nftHelper" placeholder="Add the file location (Ex: /files/Brazukas)" required></input>
                                    <small id="emailHelp" className="form-text text-muted text-center"> Metamesk must be connected for minting new NFT's</small>
                                </div>

                                <center>
                                    <button onClick={mintPressed} type="submit" className="btn btn-primary col-md-7 col-sm-12" disabled={walletAddress ? false : true}> 
                                        { walletAddress ? "Mint " : "Mint (🦊 Metamask not connected)" }
                                    </button>
                                </center>


                            </form>
                        </center>
                    </div>
                </div>
            </div>
    </div>
    );
}

export default Minter;
