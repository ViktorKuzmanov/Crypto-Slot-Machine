// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract SlotMachine is VRFConsumerBase {

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    uint256[] public randomNumbers;

    constructor() 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        )
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4; // TODO: change this
        fee = 0.1 * 10 ** 18; // TODO: change this - 0.1 LINK (Varies by network)
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = (randomness % 4) + 1;
        randomNumbers = new uint256[](3);
        for (uint256 i = 0; i < 3; i++) {
            randomNumbers[i] = (uint256(keccak256(abi.encode(randomness, i))) % 7) + 1;
        }
        emit GenerateNumbers((randomness % 4) + 1, randomNumbers[0], randomNumbers[1], randomNumbers[2]);
    }

    event GenerateOneNumber(uint256);
    event GenerateNumbers(uint256 num1,uint256 num2,uint256 num3,uint256 num4);

    function getMultipleRandomNumbers(uint256 randomValue, uint256 n) public returns (uint256[] memory expandedValues) {
        expandedValues = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
        }
        emit GenerateNumbers(expandedValues[0], expandedValues[1], expandedValues[2], expandedValues[3]);
        randomNumbers = expandedValues;
        return expandedValues;
    }
}