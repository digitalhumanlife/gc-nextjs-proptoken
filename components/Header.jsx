import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl"> GC PropToken Mint</h1>
            <div className="mt-3">
                <img className="" src="/gctoken.ico" alt="Icon" style={{ maxWidth: "30%" }} />
            </div>
            <div className="ml-auto py-3 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
