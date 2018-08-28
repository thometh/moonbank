// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Bank = artifacts.require("./Bank.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(Bank);
};
