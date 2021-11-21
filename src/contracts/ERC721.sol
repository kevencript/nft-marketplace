// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    // token ID to owner
    mapping(uint256 => address) private _tokenOwner;

    // owner to how many tokens owned
    mapping(address => uint256) private _ownedTokensCount;

    constructor() {}
}
