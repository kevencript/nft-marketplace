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

    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool indexed approved
    );

    // token ID => owner
    mapping(uint256 => address) private _tokenOwner;

    // owner => how many tokens owned
    mapping(address => uint256) private _ownedTokensCount;

    // token ID => approved address
    mapping(uint256 => address) private _tokenApprovals;

    // owner => mapping of operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

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

    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        require(
            _exists(tokenId),
            "ERC721: operator query for nonexistent token"
        );

        address owner = ownerOf(tokenId);
        return (owner == spender ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
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

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        require(_isApprovedOrOwner(msg.sender, _tokenId));
        _transferFrom(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        address owner = ownerOf(_tokenId);
        require(_to != owner, "ERC721: error aproving to current owner");
        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: current caller is not the owner or not approved for all"
        );

        _tokenApprovals[_tokenId] = _to;
        emit Approval(owner, _to, _tokenId);
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(msg.sender != operator, "ERC721: approve to caller");
        require(operator != address(0), "ERC721: operator have zero address");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(
            _exists(tokenId),
            "ERC721: approved query for nonexistent token"
        );

        return _tokenApprovals[tokenId];
    }
}
