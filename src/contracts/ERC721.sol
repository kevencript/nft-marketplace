// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // token ID => owner
    mapping(uint256 => address) private _tokenOwner;

    // owner => how many tokens owned
    mapping(address => uint256) private _ownedTokensCount;

    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    function _mint(address receiver, uint256 tokenId) internal {
        require(receiver != address(0), "ERC721: minting the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _tokenOwner[tokenId] = receiver;
        _ownedTokensCount[receiver] += 1;

        emit Transfer(address(0), receiver, tokenId);
    }

    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0));
        return _ownedTokensCount[_owner];
    }

    function ownerOf(uint256 _id) external view returns (address) {
        address owner = _tokenOwner[_id];
        require(
            owner != address(0),
            "ERC721: owner query for non-existing token"
        );
        return owner;
    }

    constructor() {}
}
