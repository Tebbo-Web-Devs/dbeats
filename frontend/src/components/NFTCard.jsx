import React, { useEffect, useState } from "react"
import { Play, Pause } from "lucide-react"
import styles from "./NFTCard.module.css"
import { Skeleton } from "./ui/Skeleton"
import { useMusic } from "../contexts/MusicProvider"

function NFTCard({ id, uri, price, genre }) {
    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [musicUrl, setMusicUrl] = useState("")
    const [artist, setArtist] = useState("")
    const [loading, setLoading] = useState(true)

    const { currentTrack, isPlaying, play, pauseTrack } = useMusic()
    const serverUrl = import.meta.env.VITE_SERVER_URL
    useEffect(() => {
        async function fetchNftData() {
            try {
                const response = await fetch(
                    `${serverUrl}/nft/nftMetadata?uri=${encodeURIComponent(uri)}`,
                )
                const data = await response.json()
                setName(data.name)
                setImageUrl(data.imageUrl)
                setMusicUrl(data.animationUrl)
                setArtist(data.attributes[0].value)
            } catch (error) {
                console.error("Error fetching NFT data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNftData()
    }, [uri])

    function handlePlayClick() {
        if (currentTrack && currentTrack.id === id && isPlaying) {
            pauseTrack()
        } else {
            play({ id, name, artist, musicUrl, imageUrl, price, genre })
        }
    }

    if (loading) {
        return <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    }

    return (
        <div className={styles.card}>
            <img src={imageUrl} alt={name}></img>
            <div className={styles.overlay}></div>
            <div className={styles.info}>
                <div className={styles.cardInfo}>
                    <h1 className={styles.trackName}>{name}</h1>
                    <h2 className={styles.artistName}>{artist}</h2>
                </div>
                <button className={styles.playButton} onClick={handlePlayClick}>
                    {currentTrack && currentTrack.id === id && isPlaying ? (
                        <Pause size={23} fill="#000" />
                    ) : (
                        <Play size={23} fill="#000" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default NFTCard
