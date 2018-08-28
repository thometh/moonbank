pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Bank is StandardToken {
string public name = "moonbank";
string public symbol = "moonbucks";
uint public decimals = 0;

    // Track how many tokens are owned by each address.
    mapping (address => uint256) public balances;
    mapping (address => bool) astronauts;
    mapping(address => mapping(address => uint256)) public allowed;

    uint256 public totalSupply = 1000;
    uint256 public cashSupply = 1000;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() public {
        // Initially assign all tokens to the contract's creator.
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function canRide(address recipient) public view returns (bool) {
        return (astronauts[recipient] == false);
    }

    function depositCash(address to, uint256 amount) public returns (bool success) {
        require(amount == 10);
        require(astronauts[to] == false);
        cashSupply += amount;
        totalSupply += amount;
        balances[to] += amount;
        astronauts[to] = true;
        emit Transfer(address(0), to, amount);
        return true;
    }

    function rideLunarModule(address to, uint256 value) public returns (bool success) {
        require(balances[msg.sender] >= value);
        require(value == 9);
        require(to == address(this));
        balances[msg.sender] -= value; // deduct from sender's balance
        balances[to] += value; // add to recipient's balance
        emit Transfer(msg.sender, to, value);
        return true;
    }

}
