"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, VolumeX, FileMusicIcon as Music2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// Track type definition
type MusicTrack = {
  id: number
  title: string
  artist: string
  duration: number
  file: string
  coverArt?: string
}

// Updated props interface
interface MusicPlayerFooterProps {
  isPlaying: boolean
  onPlayStateChange: (playing: boolean) => void
}

export function MusicPlayerFooter({ isPlaying: parentIsPlaying, onPlayStateChange }: MusicPlayerFooterProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(true)
  const [isRepeating, setIsRepeating] = useState(false)
  const [playlist, setPlaylist] = useState<MusicTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([])
  const [audioReady, setAudioReady] = useState(false)
  const [userHasInteracted, setUserHasInteracted] = useState(false)
  const [showAutoplayPrompt, setShowAutoplayPrompt] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Sync with parent isPlaying state
  useEffect(() => {
    setIsPlaying(parentIsPlaying)
  }, [parentIsPlaying])

  // Custom setter that also notifies parent - prevent infinite loops
  const setIsPlayingAndNotifyParent = (playing: boolean) => {
    setIsPlaying(playing)
    // Only notify parent if the value is actually different
    if (playing !== parentIsPlaying) {
      onPlayStateChange(playing)
    }
  }

  // Handle audio playback when isPlaying changes
  useEffect(() => {
    if (audioRef.current && playlist.length > 0 && audioReady) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error)
          setIsPlayingAndNotifyParent(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, playlist, audioReady])

  // Add click listener to detect user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserHasInteracted(true)
      setShowAutoplayPrompt(false)
      // Remove the listeners after first interaction
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [])

  // Fetch tracks from Vercel Blob
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/blob-music")
        if (!response.ok) throw new Error("Failed to fetch tracks")
        const tracks = await response.json()
        
        if (tracks && tracks.length > 0) {
          console.log("Loaded tracks:", tracks)
          setPlaylist(tracks)
          // Don't set currentTrackIndex here - let the shuffle effect handle it
        } else {
          console.log("No tracks found")
          setPlaylist([])
        }
      } catch (error) {
        console.error("Error loading music tracks:", error)
        setPlaylist([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTracks()
  }, [])

  // Initialize shuffled indices and set random starting track
  useEffect(() => {
    if (playlist.length > 0) {
      if (isShuffled) {
        const indices = shufflePlaylist()
        // Set the current track to the first track in the shuffled order
        setCurrentTrackIndex(indices[0])
      } else {
        // If not shuffled, start with the first track
        setCurrentTrackIndex(0)
        setShuffledIndices([])
      }
    }
  }, [isShuffled, playlist])

  // Handle audio ready state
  const handleCanPlay = () => {
    setAudioReady(true)
    // Apply initial volume settings when audio is ready
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      audioRef.current.muted = isMuted
    }
  }

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error occurred:", e.currentTarget.error)
    setIsPlayingAndNotifyParent(false)
    setAudioReady(false)
  }

  // Auto-play when tracks are loaded and user has interacted
  useEffect(() => {
    if (playlist.length > 0 && audioReady && userHasInteracted && parentIsPlaying && !isPlaying) {
      // Try to auto-play
      setIsPlaying(true)
      audioRef.current?.play().catch((error) => {
        console.log("Auto-play blocked by browser policy")
        setIsPlayingAndNotifyParent(false)
        setShowAutoplayPrompt(true)
      })
    }
  }, [playlist, audioReady, userHasInteracted, parentIsPlaying, isPlaying])

  // Handle play button click (including autoplay prompt)
  const handlePlayClick = () => {
    setShowAutoplayPrompt(false)
    togglePlayPause()
  }

  // Update volume when changed AND when audio becomes ready
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted, audioReady]) // Added audioReady as dependency

  // Also apply volume settings when track changes
  useEffect(() => {
    if (audioRef.current && audioReady) {
      audioRef.current.volume = volume / 100
      audioRef.current.muted = isMuted
    }
  }, [currentTrackIndex, audioReady, volume, isMuted])

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

  // Toggle play/pause - only allow if tracks are loaded and audio is ready
  const togglePlayPause = () => {
    if (playlist.length === 0) {
      console.log("No tracks available to play")
      return
    }

    const newPlayingState = !isPlaying
    
    if (newPlayingState) {
      if (audioReady) {
        audioRef.current?.play().catch((error) => {
          console.error("Playback failed:", error)
          setIsPlayingAndNotifyParent(false)
          return
        })
      }
      setIsPlayingAndNotifyParent(true)
    } else {
      audioRef.current?.pause()
      setIsPlayingAndNotifyParent(false)
    }
  }

  // Play previous track
  const playPreviousTrack = () => {
    if (playlist.length === 0) return

    let newIndex
    if (isShuffled) {
      const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex)
      newIndex = shuffledIndices[currentShuffleIndex === 0 ? shuffledIndices.length - 1 : currentShuffleIndex - 1]
    } else {
      newIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
    }

    setCurrentTrackIndex(newIndex)
    setAudioReady(false) // Reset audio ready state
  }

  // Play next track
  const playNextTrack = () => {
    if (playlist.length === 0) return

    let newIndex
    if (isShuffled) {
      const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex)
      newIndex = shuffledIndices[currentShuffleIndex === shuffledIndices.length - 1 ? 0 : currentShuffleIndex + 1]
    } else {
      newIndex = currentTrackIndex === playlist.length - 1 ? 0 : currentTrackIndex + 1
    }

    setCurrentTrackIndex(newIndex)
    setAudioReady(false) // Reset audio ready state
    setIsPlayingAndNotifyParent(true) // Auto-play the next track
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Seek to position
  const seekTo = (value: number[]) => {
    if (audioRef.current && audioReady) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (isMuted && value[0] > 0) {
      setIsMuted(false)
    }
  }

  // Updated shuffle playlist function that returns the shuffled indices
  const shufflePlaylist = () => {
    const indices = Array.from({ length: playlist.length }, (_, i) => i)

    // Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }

    setShuffledIndices(indices)
    return indices
  }

  // Toggle shuffle
  const toggleShuffle = () => {
    const newShuffleState = !isShuffled
    setIsShuffled(newShuffleState)
    
    if (newShuffleState && playlist.length > 0) {
      // When enabling shuffle, create new shuffle order and pick random starting track
      const indices = shufflePlaylist()
      setCurrentTrackIndex(indices[0])
    } else if (!newShuffleState) {
      // When disabling shuffle, reset to first track
      setCurrentTrackIndex(0)
      setShuffledIndices([])
    }
  }

  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center">
        <div className="text-gray-400 text-base">Loading music player...</div>
      </div>
    )
  }

  // No tracks state
  if (playlist.length === 0) {
    return (
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center">
        <div className="text-gray-400 text-base">No music tracks found</div>
      </div>
    )
  }

  const currentTrack = playlist[currentTrackIndex]
  const canPlay = playlist.length > 0

  return (
    <>
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex flex-col lg:flex-row items-center justify-between px-4 lg:px-6 py-2">
        {currentTrack && (
          <audio
            ref={audioRef}
            src={currentTrack.file}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleTrackEnd}
            onPlay={() => setIsPlayingAndNotifyParent(true)}
            onPause={() => setIsPlayingAndNotifyParent(false)}
            onError={handleAudioError}
            onCanPlay={handleCanPlay}
            onLoadStart={() => setAudioReady(false)}
            onLoadedMetadata={() => {
              // Also apply volume when metadata is loaded
              if (audioRef.current) {
                audioRef.current.volume = volume / 100
                audioRef.current.muted = isMuted
              }
            }}
            preload="metadata"
          />
        )}

        {/* Mobile Layout */}
        <div className="flex lg:hidden w-full flex-col space-y-3">
          {/* Top row - Track info and controls */}
          <div className="flex items-center justify-between">
            {/* Current Track Info */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <Music2 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{currentTrack.title}</div>
                <div className="text-xs text-gray-400 truncate">{currentTrack.artist}</div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={playPreviousTrack}
                disabled={!canPlay}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  canPlay && audioReady
                    ? 'bg-white hover:bg-gray-200' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                onClick={handlePlayClick}
                disabled={!canPlay}
              >
                {isPlaying ? 
                  <Pause className="w-4 h-4 text-black" /> : 
                  <Play className="w-4 h-4 text-black ml-0.5" />
                }
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={playNextTrack} 
                disabled={!canPlay}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom row - Progress bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(currentTime)}</span>
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={currentTrack.duration || 100}
                step={1}
                onValueChange={seekTo}
                disabled={!canPlay || !audioReady}
                className="w-full"
              />
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 w-96">
            <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
              <Music2 className="w-7 h-7 text-gray-400" />
            </div>
            <div>
              <div className="font-medium text-base">{currentTrack.title}</div>
              <div className="text-sm text-gray-400">{currentTrack.artist}</div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-3 flex-1 max-w-xl mx-auto">
            <div className="flex items-center space-x-5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={playPreviousTrack}
                disabled={!canPlay}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  canPlay && audioReady
                    ? 'bg-white hover:bg-gray-200' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                onClick={handlePlayClick}
                disabled={!canPlay}
              >
                {isPlaying ? 
                  <Pause className="w-5 h-5 text-black" /> : 
                  <Play className="w-5 h-5 text-black ml-0.5" />
                }
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 text-gray-400 hover:text-white hover:bg-transparent"
                onClick={playNextTrack} 
                disabled={!canPlay}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-3 w-full max-w-xl">
              <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={currentTrack.duration || 100}
                  step={1}
                  onValueChange={seekTo}
                  disabled={!canPlay || !audioReady}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-gray-400">{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Volume, Shuffle and Other Controls */}
          <div className="flex items-center space-x-3 w-96 justify-end">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-9 h-9 ${isShuffled ? 'text-green-500' : 'text-gray-400'} hover:text-white hover:bg-transparent`}
                onClick={toggleShuffle}
                disabled={!canPlay}
              >
                <Shuffle className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 text-gray-400 hover:text-white hover:bg-transparent p-0"
                onClick={toggleMute}
                disabled={!canPlay}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  disabled={!canPlay}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}