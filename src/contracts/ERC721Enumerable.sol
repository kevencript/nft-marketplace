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

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override(ERC721) {
        super.transferFrom(_from, _to, _tokenId);
        _transferTokensToOwnerEnumeration(_from, _to, _tokenId);
    }

    function _transferTokensToOwnerEnumeration(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        _removeTokensToOwnerEnumeration(_from, _tokenId);
        _addTokensToOwnerEnumeration(_to, _tokenId);
    }

    function _removeTokensToOwnerEnumeration(address _from, uint256 _tokenId)
        internal
    {
        uint256 index = _ownedTokensIndex[_tokenId];

        // Defining specifig index as the last of array
        _ownedTokens[_from][index] = _ownedTokens[_from][
            _ownedTokens[_from].length - 1
        ];
        _ownedTokens[_from].pop();

        delete _ownedTokensIndex[_tokenId];
    }

    function _addTokensToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    }

    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply(), "global index is out of bounds");
        return _allTokens[index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        require(
            index < _ownedTokens[owner].length,
            "owner index is out of bounds"
        );
        return _ownedTokens[owner][index];
    }

    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }
}
