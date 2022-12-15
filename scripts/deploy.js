const hre = require("hardhat");
const {expect} = require("chai");

let sigInstances = {};
let sigAddrs = {};
let signRoles = [
  "deployer",
  "travelX",
  "Airline",
  "seller",
  "buyer"
]


let owner;
let Stablecoin;
let StablecoinInstance;
let StablecoinInstanceAddress;

let Splitter;
let SplitterInstance;
let SplitterInstanceAddress;

let NFTicket;
let NftTicketInstance;
let NftTicketInstanceAddress;

let NftTransfer;
let NftTransferInstance;
let NftTransferInstanceAddress;

//Initialize signers
async function main(){
  const testSigners = await hre.ethers.getSigners();
      for (let iSigner = 0; iSigner < signRoles.length; iSigner++) {
        const signRole = signRoles[iSigner];
        sigInstances[signRole] = testSigners[iSigner];
        sigAddrs[signRole] = await sigInstances[signRole].getAddress();
  }
  console.log(sigAddrs.travelX);



  Stablecoin = await hre.ethers.getContractFactory("Stablecoin");
  StablecoinInstance = await Stablecoin.deploy(0);
  StablecoinInstanceAddress = StablecoinInstance.address;
  await StablecoinInstance.deployed();

  console.log(
    `Stablecoin CONTRACT:  ${StablecoinInstance.address} || 
    Deployed by ${sigAddrs.deployer}`
  );

  Splitter = await hre.ethers.getContractFactory("Splitter");
  
  SplitterInstance = await Splitter.deploy([sigAddrs.travelX, sigAddrs.Airline], [600, 400]);
  SplitterInstanceAddress = SplitterInstance.address;
  await SplitterInstance.deployed();

  NFTicket = await hre.ethers.getContractFactory("NFTicket");
  NftTicketInstance = await NFTicket.deploy(SplitterInstance.address);
  NftTicketInstanceAddress =  NftTicketInstance.address;
  await NftTicketInstance.deployed();

  console.log(
    `NFTicket CONTRACT:  ${NftTicketInstance.address} || 
    Deployed by ${sigAddrs.deployer}`
  );



  NftTransfer = await hre.ethers.getContractFactory("NFTTicketTransfer");
  NftTransferInstance = await NftTransfer.deploy(NftTicketInstanceAddress, StablecoinInstanceAddress);
  NftTransferInstanceAddress = NftTransferInstance.address;
  await NftTransferInstance.deployed();

  console.log(
    `NftTransfer CONTRACT:  ${NftTransferInstance.address} || 
    Deployed by ${sigAddrs.deployer}`
  );
  
//Mint and create ticket

 
  let nftTokenCreatorFactory = await ethers.getContractFactory("NFTicket");
  let nftTokenCreatorInstance = await nftTokenCreatorFactory.deploy(SplitterInstanceAddress);
  let nftTokenCreatorAddress = nftTokenCreatorInstance.address;
  await nftTokenCreatorInstance.deployed();

  const ownershipChange = await nftTokenCreatorInstance.transferOwnership(
    NftTransferInstanceAddress
  );
  await ownershipChange.wait();
  
  let nftOwner = await nftTokenCreatorInstance.owner();
  expect(nftOwner).to.equal(NftTransferInstanceAddress);    

  // const balanceBefore = await nftTokenCreatorInstance.balanceOf(NftTransferInstanceAddress);

  let createTxn = await NftTransferInstance.createTicket(1672341981);
  await createTxn.wait();

  // let nftTicket = await nftTokenCreatorInstance.tickets(0);
  // const balanceAfter = await nftTokenCreatorInstance.balanceOf(NftTransferInstanceAddress);
  // const ticketPrice = await nftTokenCreatorInstance.getTicketPrice(0);
  // const ticketDeadLine = nftTicket.nftDeadlineTransfer;
  // expect(balanceAfter).to.equal(balanceBefore + 1);
  // expect(ticketPrice).to.equal(0);
  // expect(ticketDeadLine).to.equal(1672341981);

  // const ticketOwner = await nftTokenCreatorInstance.ownerOf(0);
  // expect(ticketOwner).to.equal(NftTransferInstanceAddress);

};

//Sell ticket

//Buy ticket

//stopSell Ticket



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});