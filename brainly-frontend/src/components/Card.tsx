import { ShareIcon } from "../icons/ShareIcon";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
}

export function Card({ title, link, type }: CardProps) {
    // Function to extract YouTube video ID from various URL formats
    const getYouTubeVideoId = (url: string): string | null => {
        // Handle different YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    };

    const videoId = getYouTubeVideoId(link);
    
    return (
        <div>
            <div className="p-4 bg-white rounded-md border-gray-200 max-w-72 border min-h-48 min-w-72">
                <div className="flex justify-between">
                    <div className="flex items-center text-md">
                        <div className="text-gray-500 pr-2">
                            <ShareIcon />
                        </div>
                        <span className="truncate">{title}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="pr-2 text-gray-500">
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                <ShareIcon />
                            </a>
                        </div>
                        <div className="text-gray-500">
                            <ShareIcon />
                        </div>
                    </div>
                </div>
                
                <div className="pt-4">
                    {type === "youtube" && (
                        <div className="w-full">
                            {videoId ? (
                                // If we can extract video ID, try to embed
                                <div className="relative">
                                    <iframe 
                                        className="w-full h-40 rounded"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                // Fallback for invalid YouTube URLs
                                <a 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <div className="w-full h-40 bg-gradient-to-br from-red-500 to-red-600 rounded flex flex-col items-center justify-center text-white cursor-pointer hover:from-red-600 hover:to-red-700 transition-all">
                                        <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                        <span className="text-sm font-medium">YouTube Video</span>
                                        <span className="text-xs opacity-90">Click to watch</span>
                                    </div>
                                </a>
                            )}
                            
                            <div className="mt-2">
                                <a 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Watch on YouTube →
                                </a>
                            </div>
                        </div>
                    )}
                    
                    {type === "twitter" && (
                        <div className="w-full">
                            <blockquote className="twitter-tweet">
                                <a href={link.replace("x.com", "twitter.com")}></a>
                            </blockquote>
                            
                            <div className="mt-2">
                                <a 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    View on Twitter →
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}