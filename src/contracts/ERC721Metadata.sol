// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC721Metadata.sol";
import "./ERC165.sol";

contract ERC721Metadata is IERC721Metadata, ERC165 {
    string private _name;
    string private _symbol;

    constructor(string memory named, string memory symbolified) {
        bytes4 interfaceIds = bytes4(
            keccak256("name(bytes4)") ^ keccak256("symbol(bytes4)")
        );
        _registerInterface(interfaceIds);

        _name = named;
        _symbol = symbolified;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }
}
