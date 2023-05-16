import Image from "next/image"
import Head from "next/head"
import Header from "../components/Header"
import styles from "../styles/Home.module.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>GC PropToken Mint</title>
                <meta name="description" content="PropToken Minting Website" />
                <link rel="icon" href="/gctoken.ico" />
            </Head>
            <Header />
            {/* header/connect button/ nav bar/ */}
        </div>
    )
}
