import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { MissingStaticPage } from "next/dist/shared/lib/utils"

export default function Operations() {
    const { chainId: networkId } = useMoralis()
    console.log("networkId:", networkId)
    console.log("ContractAddress:" + contractAddress)
    const { runContractFunction: buyToken } = useWeb3Contract({
        abi,
        contractAddress,
        functionName: "buyToken",
        params: {},
        msgValue: 0,
    })
}
