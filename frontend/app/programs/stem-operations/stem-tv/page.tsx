"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Play,
  Search,
  ExternalLink,
  Calendar,
  Eye,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelTitle: string;
};

export default function STEMTVPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [displayedVideosCount, setDisplayedVideosCount] = useState(6);

  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVideos(videos);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = videos.filter(
        (video) =>
          video.title?.toLowerCase().includes(query) ||
          false ||
          video.description?.toLowerCase().includes(query) ||
          false ||
          video.channelTitle?.toLowerCase().includes(query) ||
          false
      );
      setFilteredVideos(filtered);
    }
    // Reset displayed count when search changes
    setDisplayedVideosCount(6);
  }, [searchQuery, videos]);

  const fetchYouTubeVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/youtube-videos");
      const data = await response.json();

      if (data.videos) {
        setVideos(data.videos);
        setFilteredVideos(data.videos);
        if (data.videos.length > 0) {
          setCurrentVideo(data.videos[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    // Scroll to video player
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatViewCount = (count: string) => {
    const num = Number.parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return count;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-12 bg-linear-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <Badge
                variant="outline"
                className="mb-4 px-4 py-2 text-sm font-medium"
              >
                Educational Content Platform
              </Badge>

              <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-balance bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                STEM-TV Ethiopia
              </h1>

              <p className="text-lg text-muted-foreground mb-6 text-pretty leading-relaxed max-w-3xl mx-auto">
                Inside Every Child is a Scientist. Watch engaging educational
                content showcasing STEM activities, innovations, and success
                stories from Ethiopia.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for videos, topics, or subjects..."
                    className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* YouTube Channel Link */}
              <Button asChild size="lg">
                <a
                  href="https://www.youtube.com/@stempowerinc.4040"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Visit Our YouTube Channel
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {currentVideo && (
          <section className="py-12 bg-black">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Video Player */}
                  <div className="lg:col-span-2">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${currentVideo.id}?rel=0`}
                        title={currentVideo.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>

                    {/* Video Info */}
                    <div className="mt-4 bg-background rounded-lg p-6">
                      <h2 className="text-2xl font-bold mb-3 text-balance">
                        {currentVideo.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatViewCount(currentVideo.viewCount)} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(currentVideo.publishedAt)}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentVideo.description}
                      </p>
                      <div className="mt-4">
                        <Button
                          asChild
                          variant="outline"
                          className="gap-2 bg-transparent"
                        >
                          <a
                            href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Watch on YouTube
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Now Playing Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-background rounded-lg p-4 max-h-[600px] overflow-y-auto">
                      <h3 className="font-bold text-lg mb-4 sticky top-0 bg-background pb-2">
                        Now Playing
                      </h3>
                      <div className="space-y-3">
                        {filteredVideos.map((video) => (
                          <div
                            key={video.id}
                            onClick={() => handleVideoClick(video)}
                            className={`flex gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors ${
                              currentVideo.id === video.id ? "bg-accent" : ""
                            }`}
                          >
                            <div className="relative shrink-0 w-32 h-20">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-full object-cover rounded"
                              />
                              {video.duration && (
                                <div className="absolute bottom-1 right-1 bg-black/90 text-white text-xs px-1 py-0.5 rounded">
                                  {video.duration}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                {video.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {video.channelTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatViewCount(video.viewCount)} views
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Videos Grid Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                All Videos from Ethiopia
              </h2>
              <p className="text-lg text-muted-foreground">
                {searchQuery
                  ? `Found ${filteredVideos.length} video(s) matching "${searchQuery}"`
                  : "Explore our complete collection of STEM content"}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-4">
                  {searchQuery
                    ? "No videos found matching your search."
                    : "No videos available at the moment."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {(searchQuery.trim() !== ""
                    ? filteredVideos
                    : filteredVideos.slice(0, displayedVideosCount)
                  ).map((video) => (
                    <Card
                      key={video.id}
                      className="group hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-t-lg">
                          <div className="bg-red-600 rounded-full p-4">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatViewCount(video.viewCount)} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(video.publishedAt)}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {video.channelTitle}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {searchQuery.trim() === "" &&
                  filteredVideos.length > displayedVideosCount && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() =>
                          setDisplayedVideosCount(filteredVideos.length)
                        }
                        variant="outline"
                        size="lg"
                        className="gap-2"
                      >
                        See More Videos
                      </Button>
                    </div>
                  )}
              </>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-linear-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join Our Learning Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our YouTube channel for regular updates on STEM
              activities, science fairs, innovation showcases, and educational
              content from Ethiopia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <a
                  href="https://www.youtube.com/@stempowerinc.4040?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Subscribe on YouTube
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
