import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Input, Button } from "web3uikit"
import { Moralis } from "moralis"

export default function Operations() {
    const { Moralis, isWeb3Enabled, chainId: networkIdinHex } = useMoralis()

    const [totalIssued, setTotalIssued] = useState("0")
    const [supplyLimit, setSupplyLimit] = useState("0")
    const [tokenPrice, setTokenPrice] = useState("0")

    const [buyPrice, setBuyPrice] = useState("0")
    const [buyAmount, setBuyAmount] = useState("0")

    let ba
    let bp

    // let buyPrice = "0"
    // let isValuesReady = false
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
        await Moralis.executeFunction(buyTokens)
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

    async function updateUIValues() {
        const supply = (await getSupplyLimit()).toString()
        console.log("Supply Limit: ", supply)
        const totalMinted = (await getTotalIssued()).toString()
        console.log("Total Minted: ", totalMinted)
        const tokenPrice = (await getTokenPrice()).toString()
        console.log("Token Price: ", tokenPrice)

        setSupplyLimit(supply)
        setTotalIssued(totalMinted)
        setTokenPrice(tokenPrice)
    }

    async function useEffectBuyTokens() {
        console.log("buyPrice updated:", buyPrice.toString())
        console.log("buyAmount updated:", buyAmount.toString())
        await buyTokens({
            onSuccess: () => {},
            onError: (error) => console.log(error),
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log("Updating UI Values")
            updateUIValues()
        }
    }, [isWeb3Enabled])

    // useEffect(() => {
    //     // Actions to perform when buyPrice or buyAmount updates
    //     console.log("buyPrice updated:", buyPrice.toString())
    //     console.log("buyAmount updated:", buyAmount.toString())
    //     useEffectBuyTokens()
    // }, [buyAmount])

    const maxSupply = ethers.utils.formatUnits(supplyLimit, 18)
    const totalMinted = ethers.utils.formatUnits(totalIssued, 18)
    const tokenPriceInEth = tokenPrice //ethers.utils.formatUnits(tokenPrice * 10 ** 18, 18)
    const maxBuy = maxSupply - totalMinted
    let typedAmount = 0

    return (
        <div>
            <div>This page is for Operations page</div>
            <br />
            <div>
                Total Supply: {maxSupply} GCT Token(s) <br />
                Token Price per token: {tokenPriceInEth} ETH
                <br />
                <br />
                {totalMinted} GCT Token(s) minted
                <br />
                {maxBuy} GCT Token(s) left to buy
            </div>
            <br />
            <div class="flex">
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

                            setBuyPrice(buyAmountInWei)
                            setBuyAmount(enteredToDecimal)

                            // isValuesReady = true

                            console.log("BuyPrice: " + buyPrice)
                            console.log("BuyAmount: " + buyAmount)

                            buybuy(buyAmountInWei, enteredToDecimal)
                            // await buyTokens()
                            // await buyTokens(buyAmount, {
                            //     value: buyPrice,
                            //     onSuccess: () => {},
                            //     onError: (error) => console.log(error),
                            // })

                            // await buyTokens({
                            //     onSuccess: () => {},
                            //     onError: (error) => console.log(error),
                            // })
                            console.log("BUYING TOKENS...")
                        }
                    }}
                    text="Buy!"
                    size="small"
                    theme="outline"
                />
            </div>
        </div>
    )
}
