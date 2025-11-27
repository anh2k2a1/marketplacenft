pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract NFTContract is ERC721, Ownable, ReentrancyGuard, ERC2981 {
    using Strings for uint256;
    string public baseURI = "https://api.mynft.com/nft/";
    uint256 public tokenCounter;
    struct Listing{
        uint256 price;
        uint256 expireTime;
        bool isListed;
    }

    mapping(uint256 => Listing) public listings;
    struct Auction{
        uint256 startPrice;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
    }
    mapping(uint256 => Auction) public auctions;

    constructor() ERC721("My Cool NFT", "MCN") Ownable(msg.sender) {
        tokenCounter = 1;
        _setDefaultRoyalty(msg.sender, 500); 
    }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    function mint(address to) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        tokenCounter++;
        return newTokenId;
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }
    function listForSale(uint256 tokenId, uint256 price, uint256 duration) public {
        bool exists;
        try this.ownerOf(tokenId) returns (address) {
            exists = true;
        } catch {
            exists = false;
        }
        require(exists, "NFT not minted");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be positive");
        require(duration > 0, "Duration must be positive");

        uint256 expire = block.timestamp + duration;
        listings[tokenId] = Listing(price, expire, true);
        approve(address(this), tokenId);
    }
    function cancelListing(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(listings[tokenId].isListed, "Not listed");

        delete listings[tokenId];
        approve(address(0), tokenId);
    }
    function buyFromListing(uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isListed, "Not for sale");
        require(block.timestamp < listing.expireTime, "Listing expired");
        require(msg.value == listing.price, "Wrong price");

        address seller = ownerOf(tokenId);
        delete listings[tokenId];

        _safeTransfer(seller, msg.sender, tokenId, "");
        payable(seller).transfer(msg.value);
    }
    function startAuction(uint256 tokenId, uint256 startPrice, uint256 duration) public {
        bool exists;
        try this.ownerOf(tokenId) returns (address) {
            exists = true;
        } catch {
            exists = false;
        }
        require(exists, "NFT not minted");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(startPrice > 0, "Start price must be positive");

        uint256 end = block.timestamp + duration;
        auctions[tokenId] = Auction(startPrice, end, 0, address(0));

        approve(address(this), tokenId);
    }

    function bid(uint256 tokenId) public payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid && msg.value >= auction.startPrice, "Bid too low");

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
    }

    function endAuction(uint256 tokenId) public nonReentrant {
        Auction memory auction = auctions[tokenId];
        require(block.timestamp >= auction.endTime, "Auction not ended");
        require(auction.highestBidder != address(0), "No bids");

        address seller = ownerOf(tokenId);
        delete auctions[tokenId];

        _safeTransfer(seller, auction.highestBidder, tokenId, "");
        payable(seller).transfer(auction.highestBid);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }


}


