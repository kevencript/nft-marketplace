// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Metadata.sol";

contract ERC721Connector is ERC721Metadata {
    // Construct ERC721Metadata for our main contract
    constructor(string memory name, string memory symbol)
        ERC721Metadata(name, symbol)
    {}
}
