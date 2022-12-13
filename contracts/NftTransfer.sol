//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "./NftTokenCreator.sol";

contract NFTTicketTransfer is Ownable {
    event personalizedNFTTicket(uint256 _id, uint256 price);
    event approveNFTTicketTransfer(address _from, address _to, uint256 id, uint256 timestamp);

    NFTicket public nftTicket;

    struct Ticket{
        uint256 ticketId;
        uint256 ticketPrize;
        bool isOpenToSell;
        bool isSelled;
    }

    constructor() {
        nftTicket = new NFTicket();
    }

    mapping (uint256 => Ticket)  public tickets;

    uint256 totalSupply = 0;

    function createPersonalizedNFTTicket(uint256 price) public onlyOwner {
        nftTicket.mint(address(this),totalSupply);
        tickets[totalSupply]= Ticket(totalSupply, price,false,false);
        totalSupply+=1;
        emit personalizedNFTTicket(totalSupply, price);       
    }


    function sellTicket(uint256 tokenID) public {
        require(nftTicket.ownerOf(tokenID) == msg.sender, "You don't own this NFT");
        tickets[tokenID].isOpenToSell = true;
    }
    
    function approveTx(uint256 tokenID, address _to) public {
        require(tickets[tokenID].isOpenToSell == true, "This ticket can't be bought at the moment");

        tickets[tokenID].isOpenToSell == false;
        tickets[tokenID].isSelled == true;

        nftTicket.safeTransferFrom(nftTicket.ownerOf(tokenID), _to, tokenID);
        emit approveNFTTicketTransfer(nftTicket.ownerOf(tokenID), _to, tokenID, block.timestamp);
    }
}