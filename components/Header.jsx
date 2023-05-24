import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-2xl"> GC PROP TOKEN</h1>
            <div className="mt-3">
                <img className="" src="/gctoken.ico" alt="Icon" style={{ maxWidth: "30%" }} />
            </div>
            <div className="ml-auto py-3 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

// import React, { useEffect, useState } from "react"
// import { useWeb3 } from "web3-hooks"
// import { ConnectButton } from "web3uikit"

// export default function Header() {
//     const { account, balance, web3 } = useWeb3()
//     const [currentBalance, setCurrentBalance] = useState(balance)

//     useEffect(() => {
//         const updateBalance = async () => {
//             if (web3 && account) {
//                 const newBalance = await web3.eth.getBalance(account)
//                 setCurrentBalance(newBalance)
//             }
//         }
//         console.log("balance: ", balance)

//         updateBalance()
//     }, [account, web3])

//     return (
//         <nav className="p-5 border-b-2 flex flex-row">
//             <h1 className="py-4 px-4 font-bold text-2xl">GC PROP TOKEN</h1>
//             <div className="mt-3">
//                 <img className="" src="/gctoken.ico" alt="Icon" style={{ maxWidth: "30%" }} />
//             </div>
//             <div className="ml-auto py-3 px-4">
//                 <ConnectButton moralisAuth={false} balance={currentBalance} />
//             </div>
//         </nav>
//     )
// }
