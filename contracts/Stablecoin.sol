// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Stablecoin is Ownable, ERC20 {

    constructor(uint256 initialSupply) public ERC20("USDFAKE", "USDFK") {
        _mint(msg.sender, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    function mintTokens (address reciver, uint256 _qty) public onlyOwner {
        _mint(reciver, _qty);
    }

    function burnTokens (address account, uint256 _qty) public onlyOwner {
        _burn (account, _qty);
    }


}