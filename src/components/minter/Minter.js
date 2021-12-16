import './Minter.css';
import React, { useEffect, useState } from "react"
import { connectWallet, mintNFT, loadContract } from '../utils'

const Minter = () => {
    // Global States
    const [isConnected, setConnectedStatus] = useState(false)
    const [walletAddress, setWallet] = useState('')
    const [status, setStatus] = useState('')
    const [isContractLoaded, setContractIsLoaded] = useState(false)
    const [nftList, setNftList] = useState([])

   // URL IMAGES FOR TESTS 
   // https://live.staticflickr.com/65535/51750026888_c2e4412c56.jpg 
   // https://live.staticflickr.com/65535/51750426254_7569d0f01b.jpg
   // https://live.staticflickr.com/65535/51750426269_97a01e572a.jpg
   // https://live.staticflickr.com/65535/51750426279_ccf0d95d13.jpg
   // https://live.staticflickr.com/65535/51749778701_159ac8377a.jpg

    // Form input
    const [nftPathToMint, setNftPathToMint] = useState('')

    useEffect(async () => {
        if (window.ethereum) { // if Metamask installed
            if(!isContractLoaded) { // verifying/loading contract
                const contractResponse = await loadContract()
                setStatus(contractResponse.status)
                setContractIsLoaded(contractResponse.success)
            }

            // Creating a list with all NFT's
            if(!nftList.length) {
                await listAllNFTs()
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

    const listAllNFTs = async () => {
        const totalSupply = await window.contract.methods.totalSupply().call()

        for (let i=0; i < totalSupply; i++) {
            const nft = await window.contract.methods.BrazukasArray(i).call()
            if(nft !== nftList[i]) nftList.push(nft)
        }
        
        return nftList
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
            <div className="container mt-5">
                
                {/* Mint Section  */}
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

                {/* NFT's listing Section */}
                <div className='row'>
                {nftList.map((brazuka,key) => {
                    return(
                        <div className='col-4 mt-5' key={key}>
                            <div className="card" style={{ width: '18rem'}}>
                                <center>
                                    <img src={brazuka} className="card-img-top" style={{ 'maxWidth': '96%', 'marginTop':'6px' }}></img>
                                </center>
                                <div className="card-body">
                                    <h5 className="card-title">Brazuka</h5>
                                    <p className="card-text">Brazukas are the most interesting NFT's nowadays!</p>
                                    {/* <a href="" className="btn btn-primary">Buy Now $</a> */}
                                </div>
                            </div>
                        </div>                       
                    )
                })}
                </div>
            </div>
    </div>
    );
}

export default Minter;
