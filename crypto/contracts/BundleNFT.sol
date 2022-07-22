//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "contracts/EffectsAllowList.sol";
import "contracts/IBundleNFT.sol";


contract BundleNFT is
    IBundleNFT,
    Initializable,
    OwnableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable
{
    mapping(uint256 => NFT[]) public bundles;
    uint256 public bundleFee;
    EffectsAllowList public effectsAllowList;


    function initialize(string memory name_, string memory symbol_)
        public
        initializer
    {
        __Ownable_init();
        __ERC721_init(name_, symbol_);
        __ERC721URIStorage_init();
        __ERC721Enumerable_init();

    }

    event MintMessage(uint256 message);

    function bundle(NFT[] memory _tokens) override public payable returns (uint256) {
        require(msg.value >= bundleFee, "Bundle fee not paid"); // todo: maybe vulnerable to reentrancy attacks
        checkAllowList(_tokens);

        uint256 tokenId = uint256(keccak256(abi.encode(_tokens)));
        uint256 tokensLen = _tokens.length;
        for (uint256 i = 0; i < tokensLen; ) {
            _tokens[i].token.safeTransferFrom(
                msg.sender,
                address(this),
                _tokens[i].tokenId
            );
            bundles[tokenId].push(_tokens[i]); // todo: verify safety
            unchecked {
                ++i;
            }
        }
        _safeMint(msg.sender, tokenId);
        emit MintMessage(tokenId);
        return tokenId;
    }

    function mintItem(
        address to,
        uint256 tokenId,
        string memory uri
    ) public payable returns (uint256) {
        require(!_exists(tokenId), "mintItem is not permitted");
        _safeMint(to, tokenId);
        emit MintMessage(tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    function mintItem(address to, string memory uri)
        public
        payable
        returns (uint256)
    {
        uint256 tokenId = uint256(keccak256(abi.encode(uri)));
        return mintItem(to, tokenId, uri);
    }

    /**
     * @dev Check if the msg.sender is allowed to add NFTs to bundle.
     *      This is useful to prevent spamming with potentially
     *      dangerous/unwanted NFTs.
     */
    function allowedToAddNFTs(uint256 tokenId) public view returns (bool) {
        if (ownerOf(tokenId) == msg.sender) return true;
        return false;
    }

    function allowedToRemoveNFTs(uint256 tokenId) public view returns (bool) {
        if (ownerOf(tokenId) == msg.sender) return true;
        return false;
    }

    // Compare tokens without TokenRole.
    function isEqual(NFT memory nft1, NFT memory nft2)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(nft1.token, nft1.tokenId)) ==
            keccak256(abi.encodePacked(nft2.token, nft2.tokenId)));
    }

    /**
     * @dev Add NFT to bundle.
     */
    function addNFTsToBundle(
        uint256 tokenId,
        NFT[] memory _tokens,
        string memory tokenURI
    ) public {
        require(allowedToAddNFTs(tokenId), "Operation is not permitted");
        for (uint256 i = 0; i < _tokens.length; i++) {
            _tokens[i].token.safeTransferFrom(
                msg.sender,
                address(this),
                _tokens[i].tokenId
            );
            bundles[tokenId].push(_tokens[i]); // todo: verify safety
        }
        _setTokenURI(tokenId, tokenURI);
    }

    /**
     * @dev Remove NFTs from bundle.
     *      Important things:
     *      1) arguents are tokens and not indexes to gurantee a safety against a replay attack
     *      2) you can not remove base token.
     *      3) compared to unbundle method, which is considered a last resort,
     *         removeNFTsToBundle is all-or-nothing sematics, to make its usage more predictable
     *         and easier for third-party callers.
     */
    function removeNFTsFromBundle(
        uint256 _tokenId,
        NFT[] memory _tokens,
        string memory tokenURI
    ) public override {
        require(allowedToRemoveNFTs(_tokenId), "Operation is not permitted");

        NFT[] memory _bundle = bundles[_tokenId];
        delete (bundles[_tokenId]);
        uint256[] memory _newBundle = new uint256[](_bundle.length);
        uint256 _newBundleSize = 0;

        for (uint256 i = 0; i < _tokens.length; ++i) {
            bool found = false;
            for (uint256 j = 0; j < _bundle.length; ++j) {
                if (isEqual(_tokens[i], _bundle[j])) {
                    require(
                        _bundle[j].role != TokenRole.Modifier &&
                            _bundle[j].role != TokenRole.Original,
                        "The token you are trying to remove has a special role"
                    );
                    found = true;
                    break;
                }
            }
            require(
                found,
                "One of NFTs you asked to remove does not exist in the bundle"
            );
        }

        for (uint256 i = 0; i < _bundle.length; ++i) {
            bool shouldRemoveToken = false;
            for (uint256 j = 0; j < _tokens.length; ++j) {
                if (isEqual(_bundle[i], _tokens[j])) {
                    shouldRemoveToken = true;
                    break;
                }
            }
            if (shouldRemoveToken) {
                _bundle[i].token.safeTransferFrom(
                    address(this),
                    msg.sender,
                    _bundle[i].tokenId
                );
            } else {
                _newBundle[_newBundleSize] = i;
                _newBundleSize += 1;
            }
        }
        if (_newBundleSize > 0) {
            for (uint256 i = 0; i < _newBundleSize; i++) {
                bundles[_tokenId].push(_bundle[_newBundle[i]]); // todo: verify safety
            }
        }
        _setTokenURI(_tokenId, tokenURI);
    }

    /**
     * @dev Bundle multiple NFTs into a merged token with new content.
     */
    function bundleWithTokenURI(NFT[] memory _tokens, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        uint256 tokenId = bundle(_tokens);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    /**
     * @dev Disassemble a bundle token.
     */
    function unbundle(uint256 _tokenId) public override {
        require(
            ownerOf(_tokenId) == msg.sender,
            "ERC721: transfer of token that is not own"
        );
        NFT[] memory _bundle = bundles[_tokenId];
        uint256[] memory _newBundle = new uint256[](_bundle.length);
        uint256 _newBundleSize = 0;
        _burn(_tokenId);
        delete (bundles[_tokenId]);
        for (uint256 i = 0; i < _bundle.length; i++) {
            (bool success, bytes memory returnData) = address(_bundle[i].token)
                .call( // This creates a low level call to the token
                abi.encodePacked( // This encodes the function to call and the parameters to pass to that function
                    bytes4(
                        keccak256(
                            bytes("safeTransferFrom(address,address,uint256)")
                        )
                    ), // This is the function identifier of the function we want to call
                    abi.encode(address(this), msg.sender, _bundle[i].tokenId) // This encodes the parameter we want to pass to the function
                )
            );
            if (!success) {
                _newBundle[_newBundleSize] = i;
                _newBundleSize += 1;
            }
        }
        if (_newBundleSize > 0) {
            _safeMint(msg.sender, _tokenId);
            for (uint256 i = 0; i < _newBundleSize; i++) {
                bundles[_tokenId].push(_bundle[_newBundle[i]]); // todo: verify safety
            }
        }
    }

    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721.onERC721Received.selector`.
     */
    function onERC721Received(
        address, /* operator */
        address, /* from */
        uint256, /* tokenId */
        bytes calldata /* data */
    ) external pure returns (bytes4) {
        // todo: revert if this is not called within `bundle`
        return this.onERC721Received.selector;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function setBundleFee(uint256 _fee) public onlyOwner {
        bundleFee = _fee;
    }

    /**
     * @dev Withdraw all fees to the owner address
     */
    function withdrawFees() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /**
     * @dev Returns list on NFTs in bundle NFT by tokenId
     */
    function bundeledTokensOf(uint256 _tokenId)
        public
        view
        returns (NFT[] memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: Bundeled tokens query for nonexistent token"
        );
        return bundles[_tokenId];
    }

    function setEffecstAllowList(EffectsAllowList _effectsAllowList) public onlyOwner {
        effectsAllowList = _effectsAllowList;
    }

    function checkAllowList(NFT[] memory _tokens) private view {
        uint32 countOriginals = 0;
        uint32 countModifiers = 0;
        uint256 originalIndex = 0;
        uint256 modifierIndex = 0;

        uint256 tokensLen = _tokens.length;
        for (uint256 i = 0; i < tokensLen; ) {
            if (_tokens[i].role == TokenRole.Original) {
                unchecked { ++countOriginals; originalIndex = i; }
            }
            if (_tokens[i].role == TokenRole.Modifier) {
                unchecked { ++countModifiers; modifierIndex = i; }
            }
            unchecked {
                ++i;
            }
        }
        require((countModifiers == 0 && countOriginals == 0) || (countModifiers == 1 && countOriginals == 1),
                "Bundling requires original + modifier or nothing");

        if (countModifiers == 1 && effectsAllowList != EffectsAllowList(address(0x0))) {
            require(effectsAllowList.checkPermission(
                address(_tokens[originalIndex].token),
                address(_tokens[modifierIndex].token)
            ), "AllowList disallows that configuration");
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return
            interfaceId == type(IBundleNFT).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return ERC721URIStorageUpgradeable.tokenURI(tokenId);
    }
}
