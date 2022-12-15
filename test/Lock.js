const {ethers} = require("hardhat");
const { expect } = require("chai");

let nftTokenCreatorFactory;
let nftTokenCreatorInstance;
let nftTokenCreatorAddress;

let NftTransferFactory;
let NftTransferInstance;
let NftTransferAddress;

let StablecoinFactory;
let StablecoinInstance;
let StablecoinAddress;

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

    it("Should deploy the stablecoin contract", async function(){
      StablecoinFactory = await hre.ethers.getContractFactory(
        "Stablecoin",
        sigInstances.deployer
      );

      StablecoinInstance = await StablecoinFactory.deploy(0);
      await StablecoinInstance.deployed();

      StablecoinAddress = StablecoinInstance.address;

      const mintTokensToBuyer =  await StablecoinInstance.mintTokens(sigAddrs.buyer, hre.ethers.utils.parseUnits("100000.0",2));
      await mintTokensToBuyer.wait();

      const buyerBalance = await StablecoinInstance.balanceOf(sigAddrs.buyer);
      expect(buyerBalance).to.equal(hre.ethers.utils.parseUnits("100000.0", 2));
      

    })

    it("Should deploy the NFT creator contract", async function () {
      nftTokenCreatorFactory = await ethers.getContractFactory("NFTicket");
      nftTokenCreatorInstance = await nftTokenCreatorFactory.deploy(sigAddrs.deployer);
      nftTokenCreatorAddress = nftTokenCreatorInstance.address;
      await nftTokenCreatorInstance.deployed();

      let nftOwner = await nftTokenCreatorInstance.owner();
      expect(nftOwner).to.equal(sigAddrs.deployer);      
    });

    it("Should deploy the NFT Transfer contract", async function(){
      
      NftTransferFactory = await ethers.getContractFactory("NFTTicketTransfer", sigInstances.deployer);
      NftTransferInstance = await NftTransferFactory.deploy(nftTokenCreatorAddress, StablecoinAddress);
      NftTransferAddress = NftTransferInstance.address;
      await NftTransferInstance.deployed();

      const NftTransferOwner = await NftTransferInstance.owner();
      expect(NftTransferOwner).to.equal(sigAddrs.deployer);
    })

    it("Should transfer ownership of NFTickets to Marketplace contract", async function () {
      const ownershipChange = await nftTokenCreatorInstance.transferOwnership(
        NftTransferAddress
      );
      ownershipChange.wait();
      nftOwner = await nftTokenCreatorInstance.owner();
      expect(nftOwner).to.equal(NftTransferAddress);
    });

  });

  describe("Minting and creating tickets", function(){
    it("Should create a new Ticket", async function(){
      const balanceBefore = await nftTokenCreatorInstance.balanceOf(NftTransferAddress);
      let createTxn = await NftTransferInstance.createTicket(1672341981);
      await createTxn.wait();

      let nftTicket = await nftTokenCreatorInstance.tickets(0);
      console.log(sigAddrs.deployer, "Address ");
      console.log(nftTokenCreatorAddress, "creator")
      console.log(NftTransferAddress, "market")

      const balanceAfter = await nftTokenCreatorInstance.balanceOf(NftTransferAddress);
      const ticketPrice = await nftTokenCreatorInstance.getTicketPrice(0);
      const ticketDeadLine = nftTicket.nftDeadlineTransfer;
      expect(balanceAfter).to.equal(balanceBefore + 1);
      expect(ticketPrice).to.equal(0);
      expect(ticketDeadLine).to.equal(1672341981);
      const ticketOwner = await nftTokenCreatorInstance.ownerOf(0);
      expect(ticketOwner).to.equal(NftTransferAddress);
     

      // expect(nftTicket.ticketPrice).to.equal(ticketPrize);
      // expect(nftTicket.nftDeadlineTransfer).to.equal(72);
      // expect(tokenOwner).to.equal(sigAddrs.deployer);

    })

    // it("Should put the nft ticket to sell", async function(){
    //   const ticketPrize = ethers.utils.parseUnits("1.0", "ether");
    //   let sellTicket = await NftTransferInstance.sellTicket(0, ticketPrize);
    //   await sellTicket.wait();
    // })

    // it("Should allow to buy an ticket", async function(){
    //   let approveTx = await nftTokenCreatorInstance.approve(sigAddrs.buyer, 0);
    //   await approveTx.wait();

    //   let approveAndSelltx = await NftTransferInstance.transferTicket(0, sigAddrs.buyer);
    //   await approveAndSelltx.wait();
    // })
  })
});