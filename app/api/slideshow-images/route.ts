import { list } from "@vercel/blob"

export async function GET() {
  try {
    // List all blobs in the slideshow folder
    const response = await list({ prefix: "slideshow/" })

    // If no blobs found, return empty array
    if (!response.blobs || response.blobs.length === 0) {
      return Response.json([])
    }

    // Map the blob data to the format expected by the slideshow
    const images = response.blobs
      .filter(blob => {
        // Only include actual image files
        const filename = blob.pathname.toLowerCase()
        return filename.endsWith('.jpg') || 
               filename.endsWith('.jpeg') || 
               filename.endsWith('.png') || 
               filename.endsWith('.gif') || 
               filename.endsWith('.webp')
      })
      .map((blob, index) => {
        // Extract filename from the pathname
        const filename = blob.pathname.split("/").pop() || ""
        const nameWithoutExtension = filename.split(".")[0]

        return {
          id: index + 1,
          src: blob.url, // Use the Blob URL directly
          alt: nameWithoutExtension.replace(/[-_]/g, ' '), // Convert filename to readable alt text
          filename: filename
        }
      })
      // Sort by filename to ensure consistent order
      .sort((a, b) => a.filename.localeCompare(b.filename))

    return Response.json(images)
  } catch (error) {
    console.error("Error fetching slideshow images from Blob storage:", error)
    // Return empty array instead of error
    return Response.json([])
  }
}