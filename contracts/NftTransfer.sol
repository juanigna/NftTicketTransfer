//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NftTokenCreator.sol";

contract NFTTicketTransfer is Ownable {
    event approveNFTTicketTransfer(address _from, address _to, uint256 id, uint256 timestamp);

   
    NFTicket public nftTicket;
    IERC20 FakeUSDtoken;
    address splitter;

    constructor(address _erc721, address _erc20) {
        FakeUSDtoken = IERC20(_erc20);
        nftTicket = NFTicket(_erc721);
    }

    function createTicket(uint256 timestamp) public {
        nftTicket.createPersonalizedNFTTicket(timestamp);
    }

    function sellTicket(uint256 _tokenId, uint256 _ticketPrice) public {
        require(nftTicket.ownerOf(_tokenId) == msg.sender, "You don't own this NFT"); 

        nftTicket.setTicketPrice(_tokenId, _ticketPrice);
    }
    
    function transferTicket(uint256 _tokenId, address _to) public {
        require(!nftTicket.isOnSale(_tokenId), "Token is not open to sell");
        require(FakeUSDtoken.balanceOf(msg.sender) >= nftTicket.getTicketPrice(_tokenId));

        FakeUSDtoken.transferFrom(msg.sender, nftTicket.ownerOf(_tokenId), nftTicket.getTicketPrice(_tokenId)*95/100);
        FakeUSDtoken.transferFrom(msg.sender, splitter,nftTicket.getTicketPrice(_tokenId)*5/100);

        nftTicket.safeTransferFrom(nftTicket.getTicketOwner(_tokenId), _to, _tokenId);
        emit approveNFTTicketTransfer(nftTicket.getTicketOwner(_tokenId), _to, _tokenId, block.timestamp);
    }
}