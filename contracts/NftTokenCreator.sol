//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTicket is ERC721Royalty, Ownable {
    event personalizedNFTTicket(uint256 _id, uint256 price);

    using Counters for Counters.Counter;
    Counters.Counter tokenCounter;

    address splitter;

    struct Ticket{
        uint256 ticketPrice;
        uint256 nftDeadlineTransfer;
    }


    mapping (uint256 => Ticket)  public tickets;

    constructor(address _splitter) ERC721("TRAVELX", "TX"){
        splitter = _splitter;
        _setDefaultRoyalty(splitter, 5000);
    }

    function createPersonalizedNFTTicket(uint256 _nftDeadlineTransfer) public onlyOwner {
        uint _tokenCount = tokenCounter.current();
        _mint(msg.sender, _tokenCount);
        tickets[_tokenCount]= Ticket(0, _nftDeadlineTransfer);
        tokenCounter.increment();
        emit personalizedNFTTicket(_tokenCount, 0);       
    }

    function getTicketPrice(uint256 _ticketId) public view returns(uint256){
        return tickets[_ticketId].ticketPrice;
    }

    function setTicketPrice(uint256 _ticketId, uint256 _ticketPrice) public {
        require(ownerOf(_ticketId) == msg.sender, "Caller is not the owner of the token");
        require (ownerOf(_ticketId)== tx.origin);
        require(tickets[_ticketId].nftDeadlineTransfer > 0, "The ticket doesn't exists");
        tickets[_ticketId].ticketPrice = _ticketPrice;
    }

    function getTicketOwner(uint _tokenId) public view returns(address){
        return ownerOf(_tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenID, /* firstTokenId */
        uint256 batchSize
    ) internal virtual override {
        require(batchSize == 1, "Incorrect batch size");
        tickets[firstTokenID].ticketPrice = 0;
        super._beforeTokenTransfer(from,to,firstTokenID, batchSize);
    }
}