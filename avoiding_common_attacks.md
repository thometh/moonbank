In order to avoid common attacks I took advantage of the Open Zepplin library. Since their code is being
used in production in other projects I wanted try it out. Unfortunately I refactored my code a little late
into the game and using Open Zepplin slightly complicated it.

In any case I made attempts to avoid reentrancy in the depositCash token by having it check the bool value on astronauts first and then
set it at the end of the function so it can only be run once.

Additionally, since the cashSupply, totalSupply, and balance are all set in the same function so as not to enable
cross-function race conditions.

I protected against integer overflow/underflow using inheritance of safe math in BasicToken.
