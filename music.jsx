import "./music.css";
import React, { useRef, useState, useEffect } from 'react';
import albumArt1 from './musicimg1.png';
import albumArt2 from './musicimg2.png';
import albumArt3 from "./musicimg3.png";
import audio from "./aud2.mp3";
import { FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";
import { ImPrevious } from "react-icons/im";
import { CgPlayTrackNextO } from "react-icons/cg";
import { LuRefreshCw } from "react-icons/lu";
import { TfiControlShuffle } from "react-icons/tfi";
import { GiSoundOn, GiSoundOff } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

const songs = [
    {
        title: 'Song Title 1',
        artist: 'Artist Name 1',
        albumArt: albumArt1,
        year: 2002,
        audioSrc: audio
    },
    {
        title: 'Song Title 2',
        artist: 'Artist Name 2',
        albumArt: albumArt2,
        year: 2004,
        audioSrc: audio
    },
    {
        title: 'Song Title 3',
        artist: 'Artist Name 3',
        albumArt: albumArt3,
        year: 2008,
        audioSrc: audio
    },
    // Add more songs here
];

function Music() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const currentSong = songs[currentSongIndex];

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        
        const audio = audioRef.current;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const updateDuration = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []) ;
   
    useEffect(() => {
        
    },[])
  

    function togglePlayPause() {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(error => {
                console.error("Audio play error: ", error);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        }
        console.log("its play")
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSeek = (event) => {
        const audio = audioRef.current;
        audio.currentTime = event.target.value;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePrevious = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
        } else {
            setCurrentSongIndex(songs.length - 1); // Go to last song if at the beginning
        }
    };

    const handleNext = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
        } else {
            setCurrentSongIndex(0); // Go to first song if at the end
        }
    };

    const handleRefresh = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        if (!isPlaying) {
            audio.play().catch(error => {
                console.error("Audio play error: ", error);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        }
    };

    const handleShuffle = () => {
        const randomIndex = Math.floor(Math.random() * songs.length);
        setCurrentSongIndex(randomIndex);
    };

    return (
        <div className="column-container">
            <h3>QUICK SEARCH</h3>
            <fieldset className="music-quick-search">
                <input type="text" placeholder="Type here to search" />
                <button><FaSearch /></button>
            </fieldset>
            <h3>MOST POPULAR</h3>
            <div className="music-sub-cont">
                {songs.map((song, index) => (
                    <div key={index} className="songs-container" onClick={() => { setCurrentSongIndex(index); setIsPlaying(true); }}>
                        <img src={song.albumArt} alt={`${song.title} album art`} />
                        <div className="music-title-container">
                            <h3>{song.title}</h3>
                            <h4>{song.year}</h4>
                        </div>
                        <button><FaPlay className="faplay-icon"/></button>
                    </div>
                ))}
            </div>
            <div className="music-card-container">
                <div className="music-card">
                    <img src={currentSong.albumArt} alt={`${currentSong.title} album art`} className="album-art" />
                    <div className="song-info">
                        <h2>{currentSong.title}</h2>
                        <p>{currentSong.artist}</p>
                        <div className="input-container">
                            <div className="time">{formatTime(currentTime)}</div>
                            <input
                                type="range"
                                min="0"
                                max={duration}
                                value={currentTime}
                                onChange={handleSeek}
                            />
                            <div className="time">{formatTime(duration)}</div>
                        </div>
                    </div>
                    <div className="button-container">
                        <LuRefreshCw className="footer-icon" onClick={handleRefresh} />
                        <button className="button-container-sub-1" onClick={handlePrevious}><ImPrevious /></button>
                        <button onClick={togglePlayPause} className="button-container-sub">
                            {!isPlaying ? <FaRegPlayCircle /> : <FaRegPauseCircle />}
                        </button>
                        <button className="button-container-sub-1" onClick={handleNext}><CgPlayTrackNextO /></button>
                        <TfiControlShuffle className="footer-icon" onClick={handleShuffle} />
                    </div>
                    <div onClick={toggleMute} className="sound">
                        {isMuted ? <GiSoundOff /> : <GiSoundOn />}
                    </div>
                    <audio ref={audioRef} src={currentSong.audioSrc}></audio>
                </div>
            </div>
            
        </div>
    );
    
}

export default Music;
