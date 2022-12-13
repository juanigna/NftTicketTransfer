const {ethers} = require("hardhat");
const { expect } = require("chai");

let nftTokenCreatorFactory;
let nftTokenCreatorInstance;

let NftTransferFactory;
let NftTransferInstance;

describe("Lock", function () {
  describe("Deployment", function () {
    it("Should deploy", async function () {
      nftTokenCreatorFactory = await ethers.getContractFactory("NFTicket");
      nftTokenCreatorInstance = await nftTokenCreatorFactory.deploy();
      await nftTokenCreatorInstance.deployed();

      NftTransferFactory = await ethers.getContractFactory("NFTTicketTransfer");
      NftTransferInstance = await NftTransferFactory.deploy();
      await NftTransferInstance.deployed();
    });
  });

  describe("Minting and creating tickets", function(){
    it("Should create a new Ticket", async function(){
      const ticketPrize = ethers.utils.parseUnits("1.0", "ether");
      let createTxn = await NftTransferInstance.createPersonalizedNFTTicket(ticketPrize);
      await createTxn.wait();

      let nftPrice = await NftTransferInstance.tickets(0).ticketPrize;

      expect(nftPrice).to.equal(ticketPrize);
    })
  })
});