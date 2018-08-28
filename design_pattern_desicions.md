I initially used the EIP20 token code as the base of the Bank smart contract.
However, in order to take advantage of the library the Open Zepplin provided I refactored the code to include it.
Some functions like the depositCash function are unique because they are available publicly rather
than through an owner modifier.

The react app was meant to be linear in order to mimic a one-way story. Users could go through the story once
and the logic as to whether a user will be shown the beginning of the story or the end of the story is based on
whether they are considered an astronaut by the smart contract. When a user depositsCash, they are made into an astronaut.
When the function is done they are no longer able to call it again since the function checks the user's astronaut status.

The goal of the app was to show that many users could use the same ATM as an interface and as long as the balances were
held publicly auditing is easy. 
