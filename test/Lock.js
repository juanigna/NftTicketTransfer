const {ethers} = require("hardhat");
const { expect } = require("chai");

let nftTokenCreatorFactory;
let nftTokenCreatorInstance;

let NftTransferFactory;
let NftTransferInstance;

let sigInstances = {};
let sigAddrs = {};
let signRoles = [
  "deployer",
  "travelX",
  "Airline",
  "seller",
  "buyer"
]

describe("Lock", function () {
  describe("Deployment", function () {
    it("Should initialize the signers", async function(){
      const testSigners = await hre.ethers.getSigners();
      for (let iSigner = 0; iSigner < signRoles.length; iSigner++) {
        const signRole = signRoles[iSigner];
        sigInstances[signRole] = testSigners[iSigner];
        sigAddrs[signRole] = await sigInstances[signRole].getAddress();
      }
    })

    it("Should deploy", async function () {
      nftTokenCreatorFactory = await ethers.getContractFactory("NFTicket");
      nftTokenCreatorInstance = await nftTokenCreatorFactory.deploy(sigAddrs.deployer);
      await nftTokenCreatorInstance.deployed();

      NftTransferFactory = await ethers.getContractFactory("NFTTicketTransfer");
      NftTransferInstance = await NftTransferFactory.deploy(sigAddrs.deployer);
      await NftTransferInstance.deployed();
    });
  });

  describe("Minting and creating tickets", function(){
    it("Should create a new Ticket", async function(){
      const ticketPrize = ethers.utils.parseUnits("1.0", "ether");
      let createTxn = await nftTokenCreatorInstance.createPersonalizedNFTTicket(ticketPrize, 72);
      await createTxn.wait();

      let nftTicket = await nftTokenCreatorInstance.tickets(1);

      expect(nftTicket.ticketPrice).to.equal(ticketPrize);
      expect(nftTicket.nftDeadlineTransfer).to.equal(72);

    })

    it("Should put the nft ticket to sell", async function(){
      const ticketPrize = ethers.utils.parseUnits("1.0", "ether");
      let sellTicket = await NftTransferInstance.sellTicket(1, ticketPrize);
      await sellTicket.wait();
    })

    // it("Should allow to buy an ticket", async function(){
    //   let approveTx = await nftTokenCreatorInstance.approve(sigAddrs.buyer, 1);
    //   await approveTx.wait();

    //   let approveAndSelltx = await NftTransferInstance.approveTx(1, sigAddrs.buyer);
    //   await approveAndSelltx.wait();
    // })
  })
});