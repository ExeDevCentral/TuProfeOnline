import React from 'react';

interface VideoBackgroundProps {
    videoUrl: string;
    fallbackImageUrl?: string;
    overlayOpacity?: number;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
    videoUrl,
    fallbackImageUrl,
    overlayOpacity = 0.6
}) => {
    return (
        <div className="video-bg-container">
            <video
                autoPlay
                loop
                muted
                playsInline
                poster={fallbackImageUrl}
                className="w-full h-full object-cover"
                style={{ opacity: 1 - overlayOpacity }}
                aria-label="Background video of starry night sky"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div
                className="video-overlay"
                style={{ backgroundColor: `rgba(15, 23, 42, ${overlayOpacity})` }}
            />
        </div>
    );
};

export default VideoBackground;
