//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";


contract NFTicket is ERC721Royalty {

    constructor() ERC721("TRAVELX", "TX"){}

    function mint(address _to, uint256 _tokenId) public{
        _mint(_to, _tokenId);
    }
}