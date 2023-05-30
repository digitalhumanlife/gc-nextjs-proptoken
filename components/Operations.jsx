import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Input, Button } from "web3uikit"
import { Moralis } from "moralis"

export default function Operations() {
    const { Moralis, account, isWeb3Enabled, chainId: networkIdinHex } = useMoralis()

    const [totalIssued, setTotalIssued] = useState("0")
    const [supplyLimit, setSupplyLimit] = useState("0")
    const [tokenPrice, setTokenPrice] = useState("0")
    const [balanceUser, setBalanceUser] = useState("0")

    const networkId = parseInt(networkIdinHex)
    const gcTokenContractAddress =
        networkId in contractAddress ? contractAddress[networkId][0] : null

    async function buybuy(buyAm, buyPr) {
        const buyTokens = {
            abi: abi,
            contractAddress: gcTokenContractAddress, // specify the networkId
            functionName: "buyTokens",
            params: { amount: buyAm },
            msgValue: buyPr,
        }
        const test = await Moralis.executeFunction(buyTokens)
        await test.wait(1)
        console.log("test confirmed: ", test)
        updateUIValues()
    }

    const { runContractFunction: getTotalIssued } = useWeb3Contract({
        abi: abi,
        contractAddress: gcTokenContractAddress, // specify the networkId
        functionName: "getTotalIssued",
        params: {},
    })

    const { runContractFunction: getSupplyLimit } = useWeb3Contract({
        abi: abi,
        contractAddress: gcTokenContractAddress, // specify the networkId
        functionName: "getSupplyLimit",
        params: {},
    })

    const { runContractFunction: getTokenPrice } = useWeb3Contract({
        abi: abi,
        contractAddress: gcTokenContractAddress, // specify the networkId
        functionName: "getTokenPrice",
        params: {},
    })

    const { runContractFunction: getBalanceOf } = useWeb3Contract({
        abi: abi,
        contractAddress: gcTokenContractAddress, // specify the networkId
        functionName: "balanceOf",
        params: { account: account },
    })

    const { runContractFunction: getDivBalanceOf } = useWeb3Contract({
        abi: abi,
        contractAddress: gcTokenContractAddress, // specify the networkId
        functionName: "getDivBalanceOf",
        params: { account: account },
    })

    async function updateUIValues() {
        const supply = (await getSupplyLimit()).toString()
        console.log("Supply Limit: ", supply)
        const totalMinted = (await getTotalIssued()).toString()
        console.log("Total Minted: ", totalMinted)
        const tokenPrice = (await getTokenPrice()).toString()
        console.log("Token Price: ", tokenPrice)
        const balanceUser = (await getBalanceOf()).toString()
        console.log("User Balance: ", balanceUser)
        setSupplyLimit(supply)
        setTotalIssued(totalMinted)
        setTokenPrice(tokenPrice)
        setBalanceUser(balanceUser)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log("Updating UI Values")
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const maxSupply = ethers.utils.formatUnits(supplyLimit, 18)
    const totalMinted = ethers.utils.formatUnits(totalIssued, 18)
    const userBalance = ethers.utils.formatUnits(balanceUser, 18)

    const tokenPriceInEth = tokenPrice //ethers.utils.formatUnits(tokenPrice * 10 ** 18, 18)
    const maxBuy = maxSupply - totalMinted
    let typedAmount = 0

    return (
        <div>
            <div>This page is for Operations page</div>
            <br />
            <div className="card">
                <div className="card-title">
                    <h2>Sinsa Villa GCT Tokens</h2>
                </div>
                <div className="card-content">
                    <div className="token-info">
                        <p>
                            Total Supply: {maxSupply} GCT Token(s) ({tokenPriceInEth} ETH / Token)
                        </p>
                    </div>
                    <div className="image-container">
                        <img className="token-image" src="/318.jpg" alt="Token Image" />
                    </div>
                </div>
                <div className="card-footer">
                    <p>{totalMinted} GCT Token(s) minted</p>
                    <p>{maxBuy} GCT Token(s) left to buy</p>
                </div>
                <div className="font-bold">You have {userBalance} GCT Token(s) in your wallet.</div>
            </div>
            <br />
            <br />
            <div className="flex">
                <Input
                    label="How many tokens do you want to buy?"
                    onChange={(event) => {
                        typedAmount = event.target.value
                        console.log("Entered: " + typedAmount)
                    }}
                    type="number"
                    validation={{
                        numberMax: maxBuy,
                        numberMin: 0,
                        required: true,
                    }}
                />
                <p>&nbsp;&nbsp;&nbsp;</p>
                <Button
                    onClick={async () => {
                        if (typedAmount > 0 && typedAmount <= maxBuy) {
                            const totalAmountToBuy = (typedAmount * tokenPrice).toString()
                            const buyAmountInWei = ethers.utils.parseUnits(totalAmountToBuy, 18)
                            const enteredToDecimal = ethers.utils.parseUnits(typedAmount, 18)

                            console.log("buyAmountInWei: " + buyAmountInWei)
                            console.log("enteredToDecimal: " + enteredToDecimal)

                            buybuy(buyAmountInWei, enteredToDecimal)
                            console.log("BUYING TOKENS...")
                        }
                    }}
                    text="Buy!"
                    size="small"
                    theme="outline"
                />
            </div>
            <div className="p-2">
                <Button
                    onClick={async () => {
                        //const userDivAmountTx = await getDivBalanceOf() // .toString()
                        const provider = new ethers.providers.Web3Provider(window.ethereum)
                        const contract = new ethers.Contract(gcTokenContractAddress, abi, provider)
                        const result = await contract.callStatic.getDivBalanceOf(account)
                        //console.log("userDivAmountTx: ", userDivAmountTx)
                        console.log("Static result: ", result.toString())
                    }}
                    text="Get dividend amount"
                    size="small"
                    theme="outline"
                />
            </div>
            <style jsx>{`
                .card {
                    border: 2px solid #ccc;
                    border-radius: 10px;
                    padding: 20px;
                    display: inline-block;
                }
                .card-title {
                    font-weight: bold;
                }
                ,
                .card-content,
                .card-footer {
                    margin-bottom: 10px;
                }
                .image-container {
                    text-align: center;
                }
                .token-image {
                    max-width: 100%;
                }
                .token-info {
                    text-align: left;
                }
                .flex {
                    display: flex;
                    align-items: center;
                }
            `}</style>
        </div>
    )
}
