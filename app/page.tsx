"use client"

import React, { useEffect } from "react"

import type { ReactElement } from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, ChevronRight, ChevronLeft, Mail, Linkedin, Github } from "lucide-react"
import { MusicPlayerFooter } from "@/my_components/music_player_footer"
import input from "../public/input.json"

// Updated scrollbar styles - removed mobile safe area stuff
const scrollbarStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
    /* Add padding to prevent content shift when scrollbar appears */
    padding-right: 6px;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;             /* Chrome, Safari, Opera */
  }
  
  /* Only show scrollbar when actively scrolling */
  .show-scrollbar-on-scroll {
    scrollbar-width: none;     /* Firefox */
  }
  
  .show-scrollbar-on-scroll::-webkit-scrollbar {
    display: none;            /* Hidden by default */
    width: 6px;               /* Width of the scrollbar */
  }
  
  .show-scrollbar-on-scroll.scrolling::-webkit-scrollbar {
    display: block;           /* Show only when scrolling */
  }
  
  .show-scrollbar-on-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 10px;
  }

  /* Prevent horizontal overflow on mobile */
  .mobile-container {
    max-width: 100vw;
    overflow-x: hidden;
  }
`

interface Experience {
  role: string
  company: string
  type: string
  date: string
  stack: string
  image: string
  details: string
  link?: string
  linkTitle?: string
}

interface Project {
  role: string
  stack: string
  image: string
  details: string
  link?: string
  linkTitle?: string
  link2?: string
  linkTitle2?: string
  link3?: string
  linkTitle3?: string
}

interface GalleryImage {
  src: string
  caption: string
}

interface Input {
  mainPfp: string
  aboutPfp: string
  resume: string
  sidebarLinks: { [key: string]: string }
  experiences: Experience[]
  projects: Project[]
  galleryImages: GalleryImage[]
  aboutMe: string
}

export default function Home(): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null)
  const [showArtistPanel, setShowArtistPanel] = useState(true)
  const [slideshowImages, setSlideshowImages] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchSlideshowImages = async () => {
      try {
        const response = await fetch("/api/slideshow-images")
        const images = await response.json()

        // Create a mapping of filename (without extension) to blob URL
        const imageMap: { [key: string]: string } = {}
        images.forEach((img: any) => {
          const nameWithoutExt = img.filename.split(".")[0]
          imageMap[nameWithoutExt] = img.src
        })

        setSlideshowImages(imageMap)
      } catch (error) {
        console.error("Error fetching slideshow images:", error)
      }
    }

    fetchSlideshowImages()
  }, [])

  const inputData = input as Input

  const experiences = inputData.experiences
  const projects = inputData.projects
  const galleryImages = inputData.galleryImages
  const iconSize = 32
  const sidebarIcons = [
    {
      icon: <Mail style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />,
      name: "mail",
      label: "Email",
    },
    {
      icon: <Linkedin style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />,
      name: "linkedin",
      label: "LinkedIn",
    },
    {
      icon: <Github style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />,
      name: "github",
      label: "GitHub",
    },
  ]
  const sidebarLinks = inputData.sidebarLinks

  const handleTrackSelect = (id: number) => {
    if (selectedTrack === id) {
      setSelectedTrack(null) // Deselect if already selected
    } else {
      setSelectedTrack(id)
    }
  }

  // Use useCallback to prevent infinite loops
  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing)
  }, [])

  // Handle scroll events to show scrollbars only when scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    element.classList.add("scrolling")

    // Remove the scrolling class after a delay when scrolling stops
    clearTimeout(Number(element.dataset.scrollTimeout))
    element.dataset.scrollTimeout = setTimeout(() => {
      element.classList.remove("scrolling")
    }, 1000).toString()
  }

  return (
    <>
      {/* Inject the scrollbar styles */}
      <style jsx global>
        {scrollbarStyles}
      </style>

      <div className="h-screen bg-black text-white flex flex-col overflow-hidden mobile-container">
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Desktop Only */}
          <div className="hidden lg:flex w-24 flex-shrink-0 bg-black flex-col items-center py-6 space-y-8">
            <div className="text-white text-3xl font-bold">|||</div>

            {/* Custom Social/App Icons */}
            {sidebarIcons.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="w-20 h-20 text-white hover:text-white hover:bg-gray-800 flex items-center justify-center"
                title={item.name}
                asChild
              >
                <a href={sidebarLinks[item.name]} target="_blank" rel="noopener noreferrer">
                  <div className="w-12 h-12 flex items-center justify-center">{item.icon}</div>
                </a>
              </Button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-grow bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col transition-all duration-300 min-w-0">
            {/* Mobile Header with Social Icons */}
            <div className="lg:hidden bg-black/50 backdrop-blur-sm border-b border-gray-700 p-3 sm:p-4">
              <div className="flex items-center justify-between max-w-full">
                <div className="text-white text-xl sm:text-2xl font-bold">|||</div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {sidebarIcons.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white hover:text-white hover:bg-gray-800 flex-shrink-0"
                      title={item.label}
                      asChild
                    >
                      <a href={sidebarLinks[item.name]} target="_blank" rel="noopener noreferrer">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                          {React.cloneElement(item.icon, { style: { width: "20px", height: "20px" } })}
                        </div>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Content - removed extra bottom padding */}
            <div
              className="flex-1 overflow-y-auto hide-scrollbar show-scrollbar-on-scroll pb-8"
              onScroll={handleScroll}
            >
              <div className="px-3 sm:px-4 lg:px-8 pb-8 pt-4 lg:pt-6 max-w-full">
                {/* Album Header */}
                <div className="flex flex-col lg:flex-row lg:items-end space-y-4 sm:space-y-6 lg:space-y-0 lg:space-x-16 mb-6 lg:mb-8">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-black rounded shadow-2xl overflow-hidden relative mx-auto lg:mx-0 flex-shrink-0">
                    <img src="/main-pfp.jpg" alt="Jonathan Ye" className="object-cover w-full h-full" loading="eager" />
                  </div>
                  <div className="flex-1 text-center lg:text-left lg:ml-8 min-w-0">
                    <div className="text-xs sm:text-sm lg:text-base text-gray-300 mb-1 sm:mb-2 lg:mb-3">Portfolio</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-3 sm:mb-4 lg:mb-6 break-words">
                      Jonathan Ye
                    </h1>
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-3 text-xs sm:text-sm lg:text-base text-gray-300">
                      <span className="font-medium text-white text-sm sm:text-base lg:text-lg">
                        Stanford University
                      </span>
                      <span className="hidden lg:inline">•</span>
                      <span>Computer Science</span>
                      <span className="hidden lg:inline">•</span>
                      <span>GPA: 3.95</span>
                      <span className="hidden lg:inline">•</span>
                      <span>2023-2027</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 mb-6 lg:mb-8">
                  <Button
                    size="icon"
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-black" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-black ml-1" />
                    )}
                  </Button>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-white hover:text-white hover:bg-gray-800 hover:border-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base flex-shrink-0"
                    asChild
                  >
                    <a href={input.resume} target="_blank" rel="noopener noreferrer">
                      Resume
                    </a>
                  </Button>
                </div>

                {/* Experience */}
                <div className="mb-8 lg:mb-10">
                  <div className="flex items-center space-x-3 text-gray-300 text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 lg:mb-8">
                    <span>Experience</span>
                  </div>

                  {/* Track List */}
                  <div className="space-y-2">
                    {experiences.map((exp, index) => (
                      <div key={index} className="group">
                        <div
                          className={`flex items-center gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded cursor-pointer transition-colors duration-200 ${
                            selectedTrack === index ? "bg-gray-800/50" : "hover:bg-gray-800/30"
                          }`}
                          onClick={() => handleTrackSelect(index)}
                        >
                          <span
                            className={`text-sm sm:text-base lg:text-lg ${selectedTrack === index ? "text-green-400" : "text-gray-400"} transition-colors duration-200 flex items-center justify-center w-6 sm:w-8 lg:w-12 flex-shrink-0`}
                          >
                            {selectedTrack === index && isPlaying ? "♪" : index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-normal text-sm sm:text-base lg:text-lg ${selectedTrack === index ? "text-green-400" : "text-white"} transition-colors duration-200 truncate`}
                            >
                              {exp.role}
                            </div>
                            <div className="text-gray-400 text-xs sm:text-sm lg:text-base truncate">{exp.company}</div>
                          </div>
                          <div className="text-right flex flex-col justify-center flex-shrink-0">
                            <div className="text-gray-400 text-xs lg:text-base mb-1">{exp.type}</div>
                            <div className="text-gray-400 text-xs lg:text-base">{exp.date}</div>
                          </div>
                        </div>

                        {/* Accordion Content */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            selectedTrack === index ? "max-h-[800px] opacity-100 mt-3" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-6 sm:ml-8 lg:ml-16 mr-3 sm:mr-4 lg:mr-6 mb-6 p-3 sm:p-4 lg:p-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                              {/* Left side - Image */}
                              <div className="flex-shrink-0">
                                <div className="w-full lg:w-48 h-24 sm:h-32 lg:h-48 bg-gray-700 rounded-lg overflow-hidden">
                                  {exp.image ? (
                                    <img
                                      src={exp.image || "/placeholder.svg"}
                                      alt={`${exp.company} logo`}
                                      className="object-cover w-full h-full"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs sm:text-sm lg:text-base">
                                      No Image
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right side - Content */}
                              <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex-1">
                                  {/* Stack */}
                                  <div className="mb-3 sm:mb-4 lg:mb-6">
                                    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                      <span className="text-gray-400 text-xs sm:text-sm lg:text-base">Stack:</span>
                                      <span className="text-green-400 font-semibold text-xs sm:text-sm lg:text-base break-words">
                                        {exp.stack}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Details */}
                                  <div className="mb-4 sm:mb-6 lg:mb-8">
                                    <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                                      {exp.details}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-auto">
                                  {exp.link && exp.linkTitle && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all duration-200 flex-shrink-0 text-xs lg:text-sm"
                                      asChild
                                    >
                                      <a href={exp.link} target="_blank" rel="noopener noreferrer">
                                        {exp.linkTitle}
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-8 lg:mb-10">
                  <div className="flex items-center space-x-3 text-gray-300 text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 lg:mb-8">
                    <span>Projects</span>
                  </div>

                  {/* Track List */}
                  <div className="space-y-2">
                    {projects.map((proj, index) => (
                      <div key={experiences.length + index} className="group">
                        <div
                          className={`flex items-center gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded cursor-pointer transition-colors duration-200 ${
                            selectedTrack === experiences.length + index ? "bg-gray-800/50" : "hover:bg-gray-800/30"
                          }`}
                          onClick={() => handleTrackSelect(experiences.length + index)}
                        >
                          <span
                            className={`text-sm sm:text-base lg:text-lg ${selectedTrack === experiences.length + index ? "text-green-400" : "text-gray-400"} transition-colors duration-200 flex items-center justify-center w-6 sm:w-8 lg:w-12 flex-shrink-0`}
                          >
                            {selectedTrack === experiences.length + index && isPlaying ? "♪" : index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-normal text-sm sm:text-base lg:text-lg ${selectedTrack === experiences.length + index ? "text-green-400" : "text-white"} transition-colors duration-200 truncate`}
                            >
                              {proj.role}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-center flex-shrink-0"></div>
                        </div>

                        {/* Accordion Content */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            selectedTrack === experiences.length + index
                              ? "max-h-[800px] opacity-100 mt-3"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-6 sm:ml-8 lg:ml-16 mr-3 sm:mr-4 lg:mr-6 mb-6 p-3 sm:p-4 lg:p-8 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                              {/* Left side - Image */}
                              {proj.image && (
                                <div className="flex-shrink-0">
                                  <div className="w-full lg:w-48 h-24 sm:h-32 lg:h-48 bg-gray-700 rounded-lg overflow-hidden">
                                    {proj.image ? (
                                      <img
                                        src={proj.image || "/placeholder.svg"}
                                        alt={`${proj.role} preview`}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs sm:text-sm lg:text-base">
                                        No Image
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Right side - Content */}
                              <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex-1">
                                  {/* Stack */}
                                  <div className="mb-3 sm:mb-4 lg:mb-6">
                                    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                      <span className="text-gray-400 text-xs sm:text-sm lg:text-base">Stack:</span>
                                      <span className="text-green-400 font-semibold text-xs sm:text-sm lg:text-base break-words">
                                        {proj.stack}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Details */}
                                  <div className="mb-4 sm:mb-6 lg:mb-8">
                                    <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                                      {proj.details}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-auto">
                                  {proj.link && proj.linkTitle && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all duration-200 flex-shrink-0 text-xs lg:text-sm"
                                      asChild
                                    >
                                      <a href={proj.link} target="_blank" rel="noopener noreferrer">
                                        {proj.linkTitle}
                                      </a>
                                    </Button>
                                  )}
                                  {proj.link2 && proj.linkTitle2 && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 flex-shrink-0 text-xs lg:text-sm"
                                      asChild
                                    >
                                      <a href={proj.link2} target="_blank" rel="noopener noreferrer">
                                        {proj.linkTitle2}
                                      </a>
                                    </Button>
                                  )}
                                  {proj.link3 && proj.linkTitle3 && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 flex-shrink-0 text-xs lg:text-sm"
                                      asChild
                                    >
                                      <a href={proj.link3} target="_blank" rel="noopener noreferrer">
                                        {proj.linkTitle3}
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Me Section - Mobile Integration */}
                <div className="lg:hidden mb-8">
                  <div className="flex items-center space-x-3 text-gray-300 text-lg sm:text-xl mb-4 sm:mb-6">
                    <span>About me</span>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6 border border-gray-700/50">
                    <div className="relative mb-4 sm:mb-6">
                      <img
                        src={input.aboutPfp || "/placeholder.svg"}
                        alt="Jonathan Ye"
                        className="rounded-lg object-cover w-full"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2">Jonathan Ye</h4>
                    <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">Software & Full-Stack Developer</p>
                    <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 whitespace-pre-line leading-relaxed">
                      {input.aboutMe}
                    </p>

                    {/* Gallery Images - Mobile */}
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative mb-4 sm:mb-6 last:mb-0">
                        <img
                          src={slideshowImages[image.src] || image.src || "/placeholder.svg"}
                          alt="Gallery Image"
                          className="rounded-lg object-cover w-full"
                          loading="lazy"
                        />
                        {image.caption && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 italic">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className={`relative transition-all duration-300 hidden lg:block ${showArtistPanel ? "w-96" : "w-0"}`}>
            {/* Collapse button */}
            <button
              onClick={() => setShowArtistPanel(!showArtistPanel)}
              className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center z-10"
            >
              {showArtistPanel ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Artist Panel */}
            <div
              className={`w-96 bg-gray-900 h-full transition-all duration-300 ease-in-out overflow-hidden ${
                showArtistPanel ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="h-full overflow-y-auto hide-scrollbar show-scrollbar-on-scroll p-8"
                onScroll={handleScroll}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-6">About me</h3>
                  <div className="relative mb-6">
                    <img
                      src={input.aboutPfp || "/placeholder.svg"}
                      alt="Jonathan Ye"
                      className="rounded-lg object-cover w-full"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="text-2xl font-bold mb-3">Jonathan Ye</h4>
                  <p className="text-base text-gray-400 mb-6">Software & Full-Stack Developer</p>
                  <p className="text-base text-gray-300 mb-6 whitespace-pre-line leading-relaxed">{input.aboutMe}</p>

                  {/* Gallery Images - Desktop */}
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative mb-6">
                      <img
                        src={slideshowImages[image.src] || image.src || "/placeholder.svg"}
                        alt="Gallery Image"
                        className="rounded-lg object-cover w-full"
                        loading="lazy"
                      />
                      {image.caption && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 italic">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Player - Hidden on Mobile */}
        <div className="hidden lg:block">
          <MusicPlayerFooter isPlaying={isPlaying} onPlayStateChange={handlePlayStateChange} />
        </div>
      </div>
    </>
  )
}
