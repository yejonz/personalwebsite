import { list } from "@vercel/blob"

export async function GET() {
  try {
    // List all blobs in your store, optionally with a prefix to filter by folder
    const response = await list({ prefix: "music/" })

    // If no blobs found, return empty array
    if (!response.blobs || response.blobs.length === 0) {
      return Response.json([])
    }

    // Map the blob data to the format expected by your music player
    const tracks = response.blobs
      .filter(blob => {
        // Only include actual audio files
        const filename = blob.pathname.toLowerCase()
        return filename.endsWith('.mp3') || filename.endsWith('.wav') || filename.endsWith('.ogg') || filename.endsWith('.m4a')
      })
      .map((blob, index) => {
        // Extract filename from the pathname without extension
        const filename = blob.pathname.split("/").pop() || ""
        const nameWithoutExtension = filename.split(".")[0]

        // Parse artist, title, and duration based on the format "Song Title-Artist Name-XmYs"
        let artist = "Unknown Artist"
        let title = nameWithoutExtension
        let duration = 180 // Default duration in seconds

        // First, check if we have a duration part in the filename
        const durationMatch = nameWithoutExtension.match(/-(\d+)m(\d+)s$/)

        // Remove duration part from the name if it exists
        let nameWithoutDuration = nameWithoutExtension
        if (durationMatch) {
          // Extract minutes and seconds
          const minutes = Number.parseInt(durationMatch[1], 10)
          const seconds = Number.parseInt(durationMatch[2], 10)
          duration = minutes * 60 + seconds

          // Remove the duration part from the name
          nameWithoutDuration = nameWithoutExtension.replace(/-\d+m\d+s$/, "")
        }

        // Now parse title and artist from the remaining name
        if (nameWithoutDuration.includes("-")) {
          const parts = nameWithoutDuration.split("-")
          title = parts[0].trim() // FIRST part = SONG TITLE
          artist = parts.slice(1).join("-").trim() // SECOND part = ARTIST
        }

        return {
          id: index + 1,
          title: title,
          artist: artist,
          duration: duration,
          file: blob.url, // Use the Blob URL directly
          coverArt: "/placeholder.svg?height=56&width=56"
        }
      })

    return Response.json(tracks)
  } catch (error) {
    console.error("Error fetching music from Blob storage:", error)
    // Return empty array instead of error to prevent fallback tracks
    return Response.json([])
  }
}