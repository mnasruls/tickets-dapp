const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const name = "TicketsDapp"
  const symbol = "TD"

  const TicketsDapp = await ethers.getContractFactory("TicketsDapp")
  const contract = await TicketsDapp.deploy(name, symbol)
  await contract.deployed()
  console.log(`Deployed TicketsDapp contract at: ${contract.address}`)

  const occasions = [
    {
      name: "GDG Jakarta",
      price: tokens(10),
      capacity: 100,
      date: "2026-01-25",
      time: "18:00 WIB",
      location: "Jakarta",
    },
    {
      name: "GDG Bandung",
      price: tokens(5),
      capacity: 50,
      date: "2026-02-25",
      time: "18:00 WIB",
      location: "Bandung",
    },
    {
      name: "GDG Surabaya",
      price: tokens(2),
      capacity: 70,
      date: "2026-03-25",
      time: "18:00 WIB",
      location: "Surabaya",
    },
    {
      name: "GDG Makassar",
      price: tokens(3),
      capacity: 80,
      date: "2026-04-25",
      time: "18:00 WITA",
      location: "Makassar",
    },
    {
      name: "GDG Yogyakarta",
      price: tokens(4),
      capacity: 60,
      date: "2026-05-25",
      time: "18:00 WITA",
      location: "Yogyakarta",
    },
    {
      name: "GDG Semarang",
      price: tokens(3),
      capacity: 70,
      date: "2026-06-25",
      time: "18:00 WIB",
      location: "Semarang",
    },
  ]

  for (let i = 0; i < occasions.length; i++) {
    const occasion = occasions[i]
    const tx = await contract.connect(deployer).listOccasion(
      occasion.name,
      occasion.price,
      occasion.capacity,
      occasion.date,
      occasion.time,
      occasion.location
    )
    await tx.wait()
    console.log(`Created occasion ${occasion.name} at ${tx.hash}`)
  }
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});