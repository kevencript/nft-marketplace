// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Connector.sol";

contract Brazukas is ERC721Connector {
    string[] public BrazukasArray;

    mapping(string => bool) _brazukaExists;

    function mint(string memory _brazuka) public {
        require(!_brazukaExists[_brazuka], "Error - Brazuka already exists");

        BrazukasArray.push(_brazuka);
        uint256 _id = BrazukasArray.length - 1;

        _mint(msg.sender, _id);

        _brazukaExists[_brazuka] = true;
    }

    constructor() ERC721Connector("Brazukas", "BZKS") {}
}
