import React, { Component } from 'react'
import Bank from '../build/contracts/Bank.json';
import getWeb3 from './util/getWeb3'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      currentIndex: 0,
      totalCount: 9,
      totalSupply: -1,
      cashSupply: -1,
      canRide: -1,
      addressBalance: 0,
      intervalId : 0
    }
  }

  nextImage = () => {
    const {currentIndex, totalCount} = this.state;
    if (currentIndex + 1 < totalCount) {
      this.setState({
        currentIndex: currentIndex + 1
      });
    }
//  this.render();
  }

  lastImage = () => {
    const {currentIndex, totalCount} = this.state;
    this.setState({
      currentIndex: totalCount - 1
    });
  }

  getValuesFromContract = () => {
    const contract = require('truffle-contract')
    const bank = contract(Bank)
    bank.setProvider(this.state.web3.currentProvider)
    var bankInstance

    return this.state.web3.eth.getCoinbase((error, coinbase) => {
      bank.deployed().then((instance) => {
        bankInstance = instance
        //console.log("coinbase : " + coinbase);
        return bankInstance.totalSupply.call({from: coinbase});
      }).then((result) => {
        //console.log("totalSupply : " + result.c[0]);
        this.setState({totalSupply: result.c[0]});
        return bankInstance.cashSupply.call({from: coinbase});
      }).then((result) => {
        //console.log("cashSupply : " + result.c[0]);
        this.setState({cashSupply: result.c[0]});
        return bankInstance.balanceOf.call(coinbase);
      }).then((result) => {
        //console.log("address Balance : " + result.c[0]);
        this.setState({addressBalance: result.c[0]});
        return bankInstance.canRide.call(coinbase, {from: coinbase});
      }).then((result) => {
        //console.log("canRide : " + result);
        if( result == false && this.state.canRide == -1)
        {
          this.lastImage();
        }
        this.setState({canRide: result});
        //this.render();
      }).catch(function (err) {
        console.log('error in getValuesFromContract : ' + err);
      });
    });
  }

  sendTransaction = () => {
    const contract = require('truffle-contract')
    const bank = contract(Bank)
    bank.setProvider(this.state.web3.currentProvider)
    var bankInstance

    this.state.web3.eth.getCoinbase((error, coinbase) => {
      bank.deployed().then((instance) => {
        bankInstance = instance
        console.log("coinbase : " + coinbase);
        return bankInstance.depositCash(coinbase, 10, {
          from: coinbase
        });
      }).then((result)=>{
        this.nextImage();
      }).catch(function (err) {
        console.log('error in sendTransaction : ' + err)
      });
    })
  }

  sendToContractAddress = () => {
    const contract = require('truffle-contract')
    const bank = contract(Bank)
    bank.setProvider(this.state.web3.currentProvider)
    var bankInstance

    this.state.web3.eth.getCoinbase((error, coinbase) => {
      bank.deployed().then((instance) => {
        bankInstance = instance;
        console.log("contract address : " + bankInstance.address);
        return bankInstance.rideRocket(bankInstance.address, 9, {from: coinbase});
      }).then((result)=>{
        this.nextImage();
      }).catch(function (err) {
        console.log('error in sendToContractAddress : ' + err);
      });
    })
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })
        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  instantiateContract() {
    this.getValuesFromContract();

    //set timer because it takes some time to be mined
    var intervalId = setInterval(this.getValuesFromContract, 1000);
    this.setState({intervalId: intervalId});
  }

  render() {

    const { currentIndex, totalCount, totalSupply, cashSupply, canRide, addressBalance } = this.state;
    let currentImage = `/images/${currentIndex + 1}.png`

    let visibleTransactionBtn = false;
    let isEndofScreen = false;
    if (currentIndex + 1 == 4 ||  currentIndex + 1 == 6)
      visibleTransactionBtn = true;
    if (currentIndex + 1 == totalCount)
      isEndofScreen = true;

    return (
      <div className="App">
        <main className="container story-img" style={{ backgroundImage: `url(${currentImage})` }}>
          <div className="pure-g">
            <div className="pure-u-1-1 text-white">

              <br/>
              {(currentIndex + 1 == 2 || currentIndex + 1 == 3 || currentIndex + 1 == 5 || currentIndex + 1 == 9) &&
                <div>
                    <h2> Total Supply: {totalSupply}</h2>
                    <h2> Cash Supply: {cashSupply}</h2>
                </div>}

              {(currentIndex + 1 == 5 || currentIndex + 1 == 9) && <h2> Address Balance: {addressBalance}</h2>}
            </div>
          </div>
          { currentIndex + 1 == 4 && <button className="btn btn-success next-button" onClick={this.sendTransaction}>Deposit cash...</button>}
          { currentIndex + 1 == 6 && <button className="btn btn-success next-button" onClick={this.sendToContractAddress}>Ride the rocket back to Earth</button>}
          {  !isEndofScreen && !visibleTransactionBtn && <button className="btn btn-success next-button" onClick={this.nextImage}>Next</button> }
        </main>
      </div>
    );
  }
}

export default App
