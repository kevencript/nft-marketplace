const { assert } = require("chai")

const Brazukas = artifacts.require("Brazukas")

// check for chai
require("chai")
    .use(
        require("chai-as-promised")
    ).should()

contract('Brazukas', async (account) => {
    
    let contract
    before(async () => {
        contract = await Brazukas.deployed()
    })

    describe("deployment", async () => {
        it("deploys successfully", async() => {
            const address = contract.address

            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })

        it("has a name", async () => {
            const name = await contract.name()
            assert.equal(name, "Brazukas")
        })

        it("has a symbol", async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, "BZKS")
        })

        it("minting succesfully", async () => {
            const nftName = "_test1"
            const result = await contract.mint(nftName)
            const event = result.logs[0].args
            const totalSupply = await contract.totalSupply()

            assert.equal(totalSupply, 1)
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', "from is the contracts")
            assert.equal(event._to, account[0], "to is the msg.sender")

            // Failure
            await contract.mint(nftName).should.be.rejected;
        })
    })

    describe("indexing", async () => {
        it("list Brazukas", async () => {
            await contract.mint("_test2")
            await contract.mint("_test3")
            await contract.mint("_test4")
            const totalSupply = await contract.totalSupply()
            const returned = []

            for(i=0; i < totalSupply; i++) {
                const returnedBrazuka = await contract.BrazukasArray(i)
                returned.push(returnedBrazuka)
            }

            const expected = ["_test1","_test2","_test3","_test4"]

            assert.equal(returned.join(","), expected.join(","))            
        })
    })
})