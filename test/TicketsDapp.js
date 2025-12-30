const { expect } = require("chai")

const contractName = "TicketsDapp"
const contractSymbol = "TD"
const occasionName = "Concert"
const occasionPrice = ethers.utils.parseEther("1","ether")
const occasionTotalTickets = 1000
const occasionDate = "2023-01-01"
const occasionTime = "18:00"
const occasionLocation = "Concert Hall"

describe("TicketsDapp", () => {
    let contract
    let owner, buyer
    beforeEach(async () => {
        [owner, buyer] = await ethers.getSigners()
        const TicketsDapp = await ethers.getContractFactory("TicketsDapp")
        contract = await TicketsDapp.deploy(contractName, contractSymbol)
        await contract.deployed()

        await contract.connect(owner).listOccasion(occasionName, occasionPrice, occasionTotalTickets, occasionDate, occasionTime, occasionLocation)
    })

    describe("Deployment", () => {
        it("Should set the right name", async () => {
            expect(await contract.name()).to.equal(contractName)
        })
        it("Should set the right symbol", async () => {
            expect(await contract.symbol()).to.equal(contractSymbol)
        })
        it("Should set the right owner", async () => {
            expect(await contract.owner()).to.equal(owner.address)
        })
    })

    describe("List Occasion", () => {
        it("Should list the occasion", async () => {
            const occasion = await contract.occasions(1)
            expect(occasion.name).to.equal(occasionName)
            expect(occasion.price).to.equal(occasionPrice)
            expect(occasion.totalTickets).to.equal(occasionTotalTickets)
            expect(occasion.availableTickets).to.equal(occasionTotalTickets)
            expect(occasion.date).to.equal(occasionDate)
            expect(occasion.time).to.equal(occasionTime)
            expect(occasion.location).to.equal(occasionLocation)
        })
        it("Should get the occasion", async () => {
            const occasion = await contract.getOccasion(1)
            expect(occasion.name).to.equal(occasionName)
            expect(occasion.price).to.equal(occasionPrice)
            expect(occasion.totalTickets).to.equal(occasionTotalTickets)
            expect(occasion.availableTickets).to.equal(occasionTotalTickets)
            expect(occasion.date).to.equal(occasionDate)
            expect(occasion.time).to.equal(occasionTime)
            expect(occasion.location).to.equal(occasionLocation)
        })
    })

    describe("Buy Ticket", () => {
        let occasion
        beforeEach(async () => {
            await contract.connect(buyer).mintTicket(1, 20, { value: occasionPrice })
            occasion = await contract.occasions(1)
        })
        it("Should buy the ticket", async () => {
            const seatTaken = await contract.seatTaken(1, 20)
            expect(seatTaken).to.equal(buyer.address)
        })
        it("Should update the seatReserved", async () => {
            const seatReserved = await contract.seatReserved(1, buyer.address)
            expect(seatReserved).to.equal(true)
        })
        it("Should update the availableTickets", async () => {
            expect(occasion.availableTickets).to.equal(occasionTotalTickets - 1)
        })
        it("Should update the seatsHasTaken", async () => {
            const seatsHasTaken = await contract.getSeatsHasTaken(1)
            expect(seatsHasTaken.length).to.equal(1)
            expect(seatsHasTaken[0]).to.equal(20)
        })
        it("Should update contract balance", async () => {
            const contractBalance = await ethers.provider.getBalance(contract.address)
            expect(contractBalance).to.equal(occasionPrice)
        })
    })

    describe("Withdraw", () => {
        beforeEach(async () => {
            await contract.connect(buyer).mintTicket(1, 20, { value: occasionPrice })
        })
        it("Should withdraw the contract balance", async () => {
            const balanceBefore = await ethers.provider.getBalance(owner.address)
            await contract.connect(owner).withdraw()
            const contractBalance = await ethers.provider.getBalance(contract.address)
            expect(contractBalance).to.equal(0)
            expect(await ethers.provider.getBalance(owner.address)).to.greaterThan(balanceBefore)
        })
    })
})
