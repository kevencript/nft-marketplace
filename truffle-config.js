module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost 
      port: 7545,            // Port for Ganache
      network_id: "*",       // Any network 
     },
  },
  contracts_directory: "./src/contracts",
  contracts_build_directory: "./src/abis", // Create JSON files from our Contracts

  compilers: {
    solc: {
      version: "^0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      },
    }
  },
};
