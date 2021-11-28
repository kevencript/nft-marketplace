// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    // token ID => owner
    mapping(uint256 => address) private _tokenOwner;

    // owner => how many tokens owned
    mapping(address => uint256) private _ownedTokensCount;

    // token ID => approved address
    mapping(uint256 => address) private _tokenApprovals;

    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    function _mint(address receiver, uint256 tokenId) internal virtual {
        require(receiver != address(0), "ERC721: minting the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _tokenOwner[tokenId] = receiver;
        _ownedTokensCount[receiver] += 1;

        emit Transfer(address(0), receiver, tokenId);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0));
        return _ownedTokensCount[_owner];
    }

    function ownerOf(uint256 _id) public view returns (address) {
        address owner = _tokenOwner[_id];
        require(
            owner != address(0),
            "ERC721: owner query for non-existing token"
        );
        return owner;
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(
            _to != address(0),
            "ERC721: error while transfering to zero address"
        );
        require(
            ownerOf(_tokenId) == _from,
            "ERC721: token not owned or do not exist"
        );

        _ownedTokensCount[_from] -= 1;
        _ownedTokensCount[_to] += 1;
        _tokenOwner[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        _transferFrom(_from, _to, _tokenId);
    }

    // 1. Require that the person who is approving is th owner
    // 2. We want approve an address to a token
    // 3. Require that we cant approve sending tokens of the owner to the owner
    // (current caller)
    // 4. update tha map of the approvals
    function approve(address _to, uint256 _tokenId) public {
        address owner = ownerOf(_tokenId);
        require(_to != owner, "ERC721: error aproving to current owner");
        require(
            msg.sender == owner,
            "ERC721: current caller is not the owner of the token"
        );
        _tokenApprovals[_tokenId] = _to;

        emit Approval(owner, _to, _tokenId);
    }
}
