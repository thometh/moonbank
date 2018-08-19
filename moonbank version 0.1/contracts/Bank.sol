pragma solidity ^0.4.21;

contract Bank {
    // Track how many tokens are owned by each address.
    mapping (address => uint256) public balances;
    mapping (address => bool) astronauts;
    mapping(address => mapping(address => uint256)) public allowed;

    string public name = "moonbank";
    string public symbol = "moonbucks";
    uint8 public decimals = 0;

    uint256 public totalSupply = 1000;
    uint256 public cashSupply = 1000;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function allowance(address _owner,address _spender) public view returns (uint256)
    {
        return allowed[_owner][_spender];
    }

    constructor() public {
        // Initially assign all tokens to the contract's creator.
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balances[msg.sender] >= value);

        balances[msg.sender] -= value;  // deduct from sender's balance
        balances[to] += value;          // add to recipient's balance
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success)
    {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success)
    {
        require(value <= balances[from]);
        require(value <= allowed[from][msg.sender]);
        require(to != address(0));  //not burn

        balances[from] -= value;
        balances[to] += value;
        allowed[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }


    function burn(uint256 amount) public {
        require(amount <= balances[msg.sender]);

        totalSupply -= amount;
        balances[msg.sender] -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function burnFrom(address from, uint256 amount) public {
        require(amount <= balances[from]);
        require(amount <= allowed[from][msg.sender]);

        totalSupply -= amount;
        balances[from] -= amount;
        allowed[from][msg.sender] -= amount;
        emit Transfer(from, address(0), amount);
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


    function rideRocket(address to, uint256 value) public returns (bool success) {
        require(balances[msg.sender] >= value);
        require(value == 9);
        require(to == address(this));
        balances[msg.sender] -= value; // deduct from sender's balance
        balances[to] += value; // add to recipient's balance
        emit Transfer(msg.sender, to, value);
        return true;
    }


}
