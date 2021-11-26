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
        _addTokensToAllTokensEnumeration(tokenId);
        _addTokensToOwnerEnumeration(receiver, tokenId);
    }

    function _addTokensToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    }

    function totalSupply() external view returns (uint256) {
        return _allTokens.length;
    }
}
