// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketsDapp is ERC721 {
    address public owner;
    uint256 public idCounter;
    uint256 public totalMinted;

    mapping(uint256 => Occasion) public occasions;
    mapping (uint256 => mapping (uint256=>address)) public seatTaken;
    mapping (uint256 => uint256[]) public seatsHasTaken;
    mapping (uint256 => mapping (address=>bool)) public seatReserved;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    struct Occasion {
        uint256 id;
        string name;
        uint256 price;
        uint256 totalTickets;
        uint256 availableTickets;
        string date;
        string time;
        string location;
    }
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        owner = msg.sender;
    }

    function listOccasion(string memory _name, uint256 _price, uint256 _totalTickets, string memory _date, string memory _time, string memory _location) public onlyOwner {
        idCounter++;
        occasions[idCounter] = Occasion(idCounter, _name, _price, _totalTickets, _totalTickets, _date, _time, _location); 
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function mintTicket(uint256 _id, uint256 _seat) public payable {
        require(occasions[_id].id > 0, "Occasion does not exist");
        require(occasions[_id].id <= idCounter, "Occasion does not exist");
        require(occasions[_id].availableTickets > 0, "No available tickets");
        require(msg.value >= occasions[_id].price, "Not enough Ether");
        require(seatTaken[_id][_seat] == address(0), "Seat already taken");
        require(_seat <= occasions[_id].totalTickets, "Seat does not exist");
        occasions[_id].availableTickets--;
        seatReserved[_id][msg.sender] = true;
        seatsHasTaken[_id].push(_seat);
        seatTaken[_id][_seat] = msg.sender;
        totalMinted++;
        _safeMint(msg.sender, totalMinted);
    }

    function getSeatsHasTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsHasTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
