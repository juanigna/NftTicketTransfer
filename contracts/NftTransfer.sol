//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "./NftTokenCreator.sol";

contract NFTTicketTransfer is Ownable {
    event approveNFTTicketTransfer(address _from, address _to, uint256 id, uint256 timestamp);

    address splliterAddress;

    NFTicket nftTicket;
    constructor(address _erc721) {
  
        nftTicket = new NFTicket(_erc721);
    }

    function sellTicket(uint256 _tokenId, uint256 _ticketPrice) public {
        require(nftTicket.getTicketOwner(_tokenId) == msg.sender, "You don't own this NFT"); 
        require(false, "Hey");

        nftTicket.setTicketPrice(_tokenId, _ticketPrice);
    }
    
    function transferTicket(uint256 tokenID, address _to) public {
        require(nftTicket.getTicketPrice(tokenID) > 0, "This ticket can't be bought at the moment");

        nftTicket.safeTransferFrom(nftTicket.ownerOf(tokenID), _to, tokenID);
        emit approveNFTTicketTransfer(nftTicket.ownerOf(tokenID), _to, tokenID, block.timestamp);
    }
}