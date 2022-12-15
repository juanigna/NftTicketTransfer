// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

/// @title A sspliter for NFTtickets sell



contract Splitter is PaymentSplitter{

    constructor(address[]memory _payees,uint256[] memory _shares)  PaymentSplitter (_payees,_shares) {}

    function pending(IERC20 token,address payee) public view returns(uint256){
       uint256 total = releasable(token,payee);
       return total;
    }
    function withdraw(IERC20 token,address payee) public  {
        release( token, payee);
    }
}