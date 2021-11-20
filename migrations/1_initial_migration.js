const Contracts = artifacts.require("Brazukas");

module.exports = function (deployer) {
  deployer.deploy(Contracts);
};
