// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ERC721Connector.sol";

contract Brazukas is ERC721Connector {
    constructor() ERC721Connector("Brazukas", "BZKS") {}
}
