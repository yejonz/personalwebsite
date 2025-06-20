"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Pause, ChevronRight, ChevronLeft, Mail, Linkedin, Github } from "lucide-react"
import { MusicPlayerFooter } from "@/my_components/music_player_footer"
import input from "../public/input.json"

// Updated scrollbar styles
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
`

interface Experience {
  role: string;
  company: string;
  type: string;
  date: string;
  stack: string;
  image: string;
  details: string;
  link?: string;
  linkTitle?: string;
}

interface Project {
  role: string;
  stack: string;
  image: string;
  details: string;
  link?: string;
  linkTitle?: string;
  link2?: string;
  linkTitle2?: string;
  link3?: string;
  linkTitle3?: string;
}

interface GalleryImage {
  src: string;
  caption: string;
}

interface Input {
  mainPfp: string;
  aboutPfp: string;
  resume: string;
  sidebarLinks: { [key: string]: string };
  experiences: Experience[];
  projects: Project[];
  galleryImages: GalleryImage[];
  aboutMe: string;
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null)
  const [showArtistPanel, setShowArtistPanel] = useState(true)

  const inputData = input as Input

  const experiences = inputData.experiences
  const projects = inputData.projects
  const galleryImages = inputData.galleryImages
  const sidebarIcons = [
    { icon: <Mail className="w-5 h-5" />, name: "mail" },
    { icon: <Linkedin className="w-5 h-5" />, name: "linkedin" },
    { icon: <Github className="w-5 h-5" />, name: "github" },
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

      <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-16 bg-black flex flex-col items-center py-4 space-y-4">
            <div className="text-white text-xl font-bold">|||</div>

            {/* Custom Social/App Icons */}
            {sidebarIcons.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-white hover:text-white hover:bg-gray-800"
                title={item.name}
                asChild
              >
                <a href={sidebarLinks[item.name]} target="_blank" rel="noopener noreferrer">
                  {item.icon}
                </a>
              </Button>
            ))}
          </div>

          {/* Main Content Area - Now with flex-grow to expand when sidebar collapses */}
          <div
            className={`flex-grow bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col transition-all duration-300`}
          >
            {/* Scrollable Content - With custom scrollbar behavior */}
            <div
              className="flex-1 overflow-y-auto hide-scrollbar show-scrollbar-on-scroll pt-4"
              onScroll={handleScroll}
            >
              <div className="px-6 pb-6">
                {/* Album Header */}
                <div className="flex items-end space-x-6 mb-6 pt-4">
                  <div className="w-60 h-60 bg-black rounded shadow-2xl overflow-hidden relative">
                    <Image
                      src="/main-pfp.jpg"
                      alt="Jonathan Ye"
                      width={240}
                      height={240}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-300 mb-2">Portfolio</div>
                    <h1 className="text-7xl font-bold mb-4">Jonathan Ye</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span className="font-medium text-white">Stanford University</span>
                      <span>•</span>
                      <span>Computer Science</span>
                      <span>•</span>
                      <span>GPA: 3.95</span>
                      <span>•</span>
                      <span>2023-2027</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-6">
                  <Button
                    size="icon"
                    className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-black" />
                    ) : (
                      <Play className="w-6 h-6 text-black ml-1" />
                    )}
                  </Button>
                  <span>•</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-white hover:text-white hover:bg-gray-800 hover:border-white px-4"
                    asChild
                  >
                    <a href={input.resume} target="_blank" rel="noopener noreferrer">
                      Resume
                    </a>
                  </Button>
                </div>

                {/* Track List Header */}
                <div className="grid grid-cols-[24px,1fr,auto] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700 mb-4"></div>

                {/* Experience */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 text-gray-300 text-xl mb-6">
                    <span>Experience</span>
                  </div>

                  {/* Track List */}
                  <div className="space-y-1">
                    {experiences.map((exp, index) => (
                      <div key={index} className="group">
                        <div
                          className={`flex items-center gap-4 px-4 py-2 rounded cursor-pointer transition-colors duration-200 ${
                            selectedTrack === index ? "bg-gray-800/50" : "hover:bg-gray-800/30"
                          }`}
                          onClick={() => handleTrackSelect(index)}
                        >
                          <span
                            className={`text-base ${selectedTrack === index ? "text-green-400" : "text-gray-400"} transition-colors duration-200 flex items-center justify-center w-10 flex-shrink-0`}
                          >
                            {selectedTrack === index && isPlaying ? "♪" : index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-normal text-base ${selectedTrack === index ? "text-green-400" : "text-white"} transition-colors duration-200 truncate`}
                            >
                              {exp.role}
                            </div>
                            <div className="text-gray-400 text-sm">{exp.company}</div>
                          </div>
                          <div className="text-right flex flex-col justify-center flex-shrink-0">
                            <div className="text-gray-400 text-sm mb-1">{exp.type}</div>
                            <div className="text-gray-400 text-sm">{exp.date}</div>
                          </div>
                        </div>

                        {/* Accordion Content with Animation */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            selectedTrack === index ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-12 mr-4 mb-4 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left side - Image */}
                              <div className="flex-shrink-0">
                                <div className="w-full lg:w-40 h-40 bg-gray-700 rounded-lg overflow-hidden">
                                  {exp.image ? (
                                    <Image
                                      src={exp.image}
                                      alt={`${exp.company} logo`}
                                      width={160}
                                      height={160}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                      No Image
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right side - Content */}
                              <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex-1">
                                  {/* Stack */}
                                  <div className="mb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-gray-400 text-sm">Stack:</span>
                                      <span className="text-green-400 font-semibold text-sm">{exp.stack}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Details */}
                                  <div className="mb-6">
                                    <p className="text-gray-300 text-sm leading-relaxed">{exp.details}</p>
                                  </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-auto">
                                  {exp.link && exp.linkTitle && <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all duration-200 flex-shrink-0"
                                    asChild
                                  >
                                    <a href={exp.link} target="_blank" rel="noopener noreferrer">
                                      {exp.linkTitle}
                                    </a>
                                  </Button>}   
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
                <div className="mb-8">
                  <div className="flex items-center space-x-2 text-gray-300 text-xl mb-6">
                    <span>Projects</span>
                  </div>

                  {/* Track List */}
                  <div className="space-y-1">
                    {projects.map((proj, index) => (
                      <div key={experiences.length + index} className="group">
                        <div
                          className={`flex items-center gap-4 px-4 py-2 rounded cursor-pointer transition-colors duration-200 ${
                            selectedTrack === experiences.length + index ? "bg-gray-800/50" : "hover:bg-gray-800/30"
                          }`}
                          onClick={() => handleTrackSelect(experiences.length + index)}
                        >
                          <span
                            className={`text-base ${selectedTrack === experiences.length + index ? "text-green-400" : "text-gray-400"} transition-colors duration-200 flex items-center justify-center w-10 flex-shrink-0`}
                          >
                            {selectedTrack === experiences.length + index && isPlaying ? "♪" : index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-normal text-base ${selectedTrack === experiences.length + index ? "text-green-400" : "text-white"} transition-colors duration-200 truncate`}
                            >
                              {proj.role}
                            </div>
                          </div>
                          <div className="text-right flex flex-col justify-center flex-shrink-0"></div>
                        </div>

                        {/* Accordion Content with Animation */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            selectedTrack === experiences.length + index ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-12 mr-4 mb-4 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left side - Image */}
                              {proj.image && <div className="flex-shrink-0">
                                <div className="w-full lg:w-40 h-40 bg-gray-700 rounded-lg overflow-hidden">
                                  {proj.image ? (
                                    <Image
                                      src={proj.image}
                                      alt={`${proj.role} preview`}
                                      width={160}
                                      height={160}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                      No Image
                                    </div>
                                  )}
                                </div>
                              </div>}

                              {/* Right side - Content */}
                              <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex-1">
                                  {/* Stack */}
                                  <div className="mb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-gray-400 text-sm">Stack:</span>
                                      <span className="text-green-400 font-semibold text-sm">{proj.stack}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Details */}
                                  <div className="mb-6">
                                    <p className="text-gray-300 text-sm leading-relaxed">{proj.details}</p>
                                  </div>
                                </div>
                                
                                {/* Action Buttons */}
                                
                                <div className="flex flex-wrap gap-3 mt-auto">
                                  {proj.link && proj.linkTitle && <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 transition-all duration-200 flex-shrink-0"
                                    asChild
                                  >
                                    <a href={proj.link} target="_blank" rel="noopener noreferrer">
                                      {proj.linkTitle}
                                    </a>
                                  </Button>} 
                                  {proj.link2 && proj.linkTitle2 && <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 flex-shrink-0"
                                    asChild
                                  >
                                    <a href={proj.link2} target="_blank" rel="noopener noreferrer">
                                      {proj.linkTitle2}
                                    </a>
                                  </Button>}
                                  {proj.link3 && proj.linkTitle3 && <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 flex-shrink-0"
                                    asChild
                                  >
                                    <a href={proj.link3} target="_blank" rel="noopener noreferrer">
                                      {proj.linkTitle3}
                                    </a>
                                  </Button>}   
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Collapsible with fixed width (not taking space when collapsed) */}
          <div className={`relative transition-all duration-300 ${showArtistPanel ? "w-80" : "w-0"}`}>
            {/* Collapse button - positioned outside of the collapsible area */}
            <button
              onClick={() => setShowArtistPanel(!showArtistPanel)}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center z-10"
            >
              {showArtistPanel ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Artist Panel */}
            <div
              className={`w-80 bg-gray-900 h-full transition-all duration-300 ease-in-out overflow-hidden ${
                showArtistPanel ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="h-full overflow-y-auto hide-scrollbar show-scrollbar-on-scroll p-6"
                onScroll={handleScroll}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">About me</h3>
                  <div className="relative mb-4">
                    <Image
                      src={input.aboutPfp}
                      alt="Jonathan Ye"
                      width={320}
                      height={200}
                      className="rounded-lg object-cover w-full"
                    />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Jonathan Ye</h4>
                  <p className="text-sm text-gray-400 mb-4">Software & Full-Stack Developer</p>
                  <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
                    {input.aboutMe}
                  </p>

                  {/* Gallery Images - Generated from array */}
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative mb-4">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt="Gallery Image"
                        width={320}
                        height={200}
                        className="rounded-lg object-cover w-full"
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

        {/* Bottom Player */}
        <MusicPlayerFooter isPlaying={isPlaying} onPlayStateChange={handlePlayStateChange} />
      </div>
    </>
  )
}
