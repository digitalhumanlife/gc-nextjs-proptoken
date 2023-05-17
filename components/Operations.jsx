import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function Operations() {
    const { isWeb3Enabled, chainId: networkIdinHex } = useMoralis()

    const [totalIssued, setTotalIssued] = useState("0")
    const [supplyLimit, setSupplyLimit] = useState("0")

    const networkId = parseInt(networkIdinHex)
    const gcTokenContractAddress =
        networkId in contractAddress ? contractAddress[networkId][0] : null
    console.log("networkId:", networkId)
    console.log("ContractAddress:" + gcTokenContractAddress)

    // const { runContractFunction: buyToken } = useWeb3Contract({
    //     abi: ,
    //     contractAddress: ,
    //     functionName: "buyToken",
    //     params: {},
    //     msgValue: 0,
    // })

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

    async function updateUIValues() {
        const supply = (await getSupplyLimit()).toString()
        console.log("Supply Limit: ", supply)
        const totalMinted = (await getTotalIssued()).toString()
        console.log("Total Minted: ", totalMinted)

        setSupplyLimit(supply)
        setTotalIssued(totalMinted)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            console.log("Updating UI Values")
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <div>This page is for Operations page</div>
            <br></br>
            <div> Total Supply: {ethers.utils.formatUnits(supplyLimit, 18)} GC-Token(s)</div>
            <div> Total Minted: {ethers.utils.formatUnits(totalIssued, 18)} GC-Token(s)</div>
        </div>
    )
}
