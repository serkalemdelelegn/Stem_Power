import { NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/backend-url"

const YOUTUBE_API_KEY = "AIzaSyBlCGcOx9LurVLkvZDKlWLxe3Rk0gg-0ks"
const CHANNEL_HANDLE = "@stempowerinc.4040"
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

interface YouTubeVideoItem {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      high: {
        url: string
      }
      medium: {
        url: string
      }
      default: {
        url: string
      }
    }
    publishedAt: string
    channelTitle: string
  }
  contentDetails?: {
    duration: string
  }
  statistics?: {
    viewCount: string
  }
}

// Convert ISO 8601 duration to readable format (e.g., PT1H2M10S -> 1:02:10)
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ""

  const hours = match[1] ? parseInt(match[1]) : 0
  const minutes = match[2] ? parseInt(match[2]) : 0
  const seconds = match[3] ? parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Get channel ID from handle
async function getChannelId(handle: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=id&forHandle=${handle.replace("@", "")}&key=${YOUTUBE_API_KEY}`
    )
    const data = await response.json()

    if (data.items && data.items.length > 0) {
      return data.items[0].id
    }
    return null
  } catch (error) {
    console.error("Error fetching channel ID:", error)
    return null
  }
}

// Get uploads playlist ID from channel ID
async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
    )
    const data = await response.json()

    if (data.items && data.items.length > 0) {
      return data.items[0].contentDetails?.relatedPlaylists?.uploads || null
    }
    return null
  } catch (error) {
    console.error("Error fetching uploads playlist:", error)
    return null
  }
}

// Helper function to get thumbnail from YouTube video ID
async function getYouTubeThumbnail(videoId: string): Promise<string> {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Helper function to enrich backend videos with YouTube API data
async function enrichVideoWithYouTubeData(videoId: string) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    )
    const data = await response.json()
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0]
      const fallbackThumbnail = await getYouTubeThumbnail(videoId)
      return {
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url || fallbackThumbnail,
        duration: video.contentDetails?.duration ? formatDuration(video.contentDetails.duration) : "",
        viewCount: video.statistics?.viewCount || "0",
        channelTitle: video.snippet.channelTitle || "STEMpower Inc.",
      }
    }
  } catch (error) {
    console.error(`Error enriching video ${videoId}:`, error)
  }
  
  return {
    thumbnail: await getYouTubeThumbnail(videoId),
    duration: "",
    viewCount: "0",
    channelTitle: "STEMpower Inc.",
  }
}

export async function GET() {
  try {
    // First, try to fetch from backend database
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/stem-tv`)
      if (backendResponse.ok) {
        const backendData = await backendResponse.json()
        
        if (backendData.success && backendData.data && backendData.data.length > 0) {
          // Transform backend videos to frontend format
          const formattedVideos = await Promise.all(
            backendData.data.map(async (video: any) => {
              const videoId = video.youtube_id || video.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1] || ""
              
              // Enrich with YouTube API data if we have a video ID
              let enrichedData = {
                thumbnail: videoId ? await getYouTubeThumbnail(videoId) : "",
                duration: "",
                viewCount: "0",
                channelTitle: "STEMpower Inc.",
              }
              
              if (videoId) {
                enrichedData = await enrichVideoWithYouTubeData(videoId)
              }
              
              return {
                id: videoId || video.id?.toString() || "",
                title: video.title,
                description: video.desctiption || video.description || "",
                thumbnail: enrichedData.thumbnail,
                publishedAt: video.published_at || video.createdAt || new Date().toISOString(),
                duration: enrichedData.duration,
                viewCount: enrichedData.viewCount,
                channelTitle: enrichedData.channelTitle,
              }
            })
          )
          
          // Filter out videos without valid IDs
          const validVideos = formattedVideos.filter((v: any) => v.id)
          
          if (validVideos.length > 0) {
            return NextResponse.json({ videos: validVideos })
          }
        }
      }
    } catch (backendError) {
      console.error("Error fetching from backend, falling back to YouTube API:", backendError)
      // Fall through to YouTube API
    }

    // Fallback to YouTube API if backend is empty or fails
    // Step 1: Get channel ID from handle
    const channelId = await getChannelId(CHANNEL_HANDLE)
    if (!channelId) {
      return NextResponse.json(
        { error: "Channel not found", videos: [] },
        { status: 404 }
      )
    }

    // Step 2: Get uploads playlist ID
    const uploadsPlaylistId = await getUploadsPlaylistId(channelId)
    if (!uploadsPlaylistId) {
      return NextResponse.json(
        { error: "Uploads playlist not found", videos: [] },
        { status: 404 }
      )
    }

    // Step 3: Get videos from uploads playlist
    const playlistResponse = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    )
    const playlistData = await playlistResponse.json()

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ videos: [] })
    }

    // Step 4: Get video IDs
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .filter(Boolean)
      .join(",")

    // Step 5: Get detailed video information (duration, view count, etc.)
    const videosResponse = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )
    const videosData = await videosResponse.json()

    // Step 6: Format videos to match expected structure
    const formattedVideos = videosData.items.map((video: YouTubeVideoItem) => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails?.duration ? formatDuration(video.contentDetails.duration) : "",
      viewCount: video.statistics?.viewCount || "0",
      channelTitle: video.snippet.channelTitle,
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error: any) {
    console.error("Error fetching YouTube videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos", message: error.message, videos: [] },
      { status: 500 }
    )
  }
}

