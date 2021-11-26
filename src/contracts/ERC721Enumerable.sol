// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC721.sol";

contract ERC721Enumerable is ERC721 {
    uint256[] private _allTokens;

    // tokenId => index in _allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    // owner => list of all owner token ids
    mapping(address => uint256[]) private _ownedTokens;

    // tokenId  => index of the owner tokens ids
    mapping(uint256 => uint256) private _ownedTokensIndex;

    function _mint(address receiver, uint256 tokenId)
        internal
        override(ERC721)
    {
        super._mint(receiver, tokenId);
        _addTokensToTotalSupply(tokenId);
    }

    function _addTokensToTotalSupply(uint256 tokenId) private {
        _allTokens.push(tokenId);
    }

    function totalSupply() external view returns (uint256) {
        return _allTokens.length;
    }
}
