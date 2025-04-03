"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Sample music tracks - in a real app, you would import these
const musicTracks = [
  {
    id: 1,
    title: "Sunset Dreams",
    artist: "Ambient Waves",
    duration: 183, // in seconds
    file: "/music/sunset-dreams.mp3",
  },
]

export function MusicPlayerFooter() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [playlist, setPlaylist] = useState([...musicTracks])
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)

  // Initialize shuffled indices
  useEffect(() => {
    if (isShuffled) {
      shufflePlaylist()
    } else {
      setShuffledIndices([])
    }
  }, [isShuffled])

  // Update audio element when track changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentTrackIndex, isPlaying])

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Handle track end
  const handleTrackEnd = () => {
    if (isRepeating) {
      // Repeat the same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(console.error)
      }
    } else {
      // Play next track
      playNextTrack()
    }
  }

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  // Play previous track
  const playPreviousTrack = () => {
    let newIndex

    if (isShuffled) {
      const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex)
      newIndex = shuffledIndices[currentShuffleIndex === 0 ? shuffledIndices.length - 1 : currentShuffleIndex - 1]
    } else {
      newIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
    }

    setCurrentTrackIndex(newIndex)
  }

  // Play next track
  const playNextTrack = () => {
    let newIndex

    if (isShuffled) {
      const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex)
      newIndex = shuffledIndices[currentShuffleIndex === shuffledIndices.length - 1 ? 0 : currentShuffleIndex + 1]
    } else {
      newIndex = currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1
    }

    setCurrentTrackIndex(newIndex)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Seek to position
  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Shuffle playlist
  const shufflePlaylist = () => {
    const indices = Array.from({ length: playlist.length }, (_, i) => i)

    // Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }

    setShuffledIndices(indices)
  }

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating)
  }

  const currentTrack = playlist[currentTrackIndex]

  return (
    <div className="w-full bg-background border-t">
      <audio
        ref={audioRef}
        src={currentTrack.file}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center min-w-0 w-full md:w-1/4">
            <div className="truncate">
              <p className="font-medium truncate">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center w-full md:w-2/4 gap-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn(isShuffled && "text-primary")}>
                <Shuffle className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={playPreviousTrack}>
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={playNextTrack}>
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleRepeat} className={cn(isRepeating && "text-primary")}>
                <Repeat className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center w-full gap-2">
              <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                min={0}
                max={currentTrack.duration}
                step={1}
                onValueChange={seekTo}
                className="w-full"
              />
              <span className="text-xs text-muted-foreground w-10">{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-full md:w-1/4 justify-end">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

