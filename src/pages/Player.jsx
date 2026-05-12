// src/pages/Player.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { ArrowLeft, Send, PictureInPicture } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { channels, appInfo, loading } = useContext(AppContext);
  const [currentChannel, setCurrentChannel] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!loading && channels.length > 0) {
      const channel = channels.find(c => c.id === id);
      if (channel) setCurrentChannel(channel);
    }
  }, [id, channels, loading]);

  // Screen Wake Lock Logic
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake Lock error:', err);
      }
    };

    requestWakeLock();
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().catch(console.error);
      }
    };
  }, []);

  const handlePiP = async () => {
    try {
      const videoElement = playerRef.current?.getInternalPlayer();
      if (videoElement && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoElement.requestPictureInPicture();
        }
      }
    } catch (error) {
      console.error("PiP error:", error);
    }
  };

  if (!currentChannel) return <div className="h-screen bg-black" />;

  const relatedChannels = channels.filter(c => c.group === currentChannel.group && c.id !== currentChannel.id);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Player Header */}
      <div className="bg-black/90 p-4 flex items-center gap-4 relative z-10">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-semibold text-sm truncate flex-1">{currentChannel.name}</h2>
      </div>

      {/* Video Player */}
      <div className="w-full aspect-video bg-black relative">
        <ReactPlayer
          ref={playerRef}
          url={currentChannel.url}
          width="100%"
          height="100%"
          playing={true}
          controls={true}
          config={{
            file: {
              forceHLS: true,
              // HLS-এর কাস্টম কনফিগারেশন Referrer পাঠানোর জন্য
              hlsOptions: {
                xhrSetup: function(xhr, url) {
                  if (currentChannel.referrer) {
                    // কিছু সার্ভার কাস্টম হেডারে Referrer এক্সেপ্ট করে
                    xhr.setRequestHeader('X-Forwarded-Referer', currentChannel.referrer);
                    xhr.setRequestHeader('X-Referer', currentChannel.referrer);
                  }
                }
              },
              attributes: {
                controlsList: 'nodownload',
                playsInline: true,
              }
            }
          }}
        />
        
        <button 
          onClick={handlePiP}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded text-white z-10 backdrop-blur-sm"
          title="Picture in Picture"
        >
          <PictureInPicture size={18} />
        </button>
      </div>

      {/* Details Section */}
      <div className="p-4 bg-gray-800 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3 overflow-hidden">
          {currentChannel.logo ? (
            <img src={currentChannel.logo} alt="" className="w-12 h-12 rounded object-contain bg-gray-900" />
          ) : (
            <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center shrink-0">
              <span className="font-bold text-gray-500">TV</span>
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <h1 className="font-bold text-lg truncate">{currentChannel.name}</h1>
            <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded w-max mt-1">
              {currentChannel.group}
            </span>
          </div>
        </div>

        <a 
          href={appInfo?.community_link} 
          target="_blank" 
          rel="noreferrer"
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors shrink-0 ml-4"
        >
          <div className="bg-blue-600/20 p-2 rounded-full text-blue-400">
            <Send size={18} />
          </div>
          <span className="text-[10px]">Report</span>
        </a>
      </div>

      {/* Related Channels */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">More in {currentChannel.group}</h3>
          <div className="flex flex-col gap-2">
            {relatedChannels.map(channel => (
              <div 
                key={channel.id}
                onClick={() => navigate(`/player/${channel.id}`, { replace: true })}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors active:scale-[0.98]"
              >
                {channel.logo ? (
                  <img src={channel.logo} alt="" className="w-10 h-10 object-contain rounded bg-gray-900" />
                ) : (
                  <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">{channel.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{channel.name}</h4>
                </div>
              </div>
            ))}
            {relatedChannels.length === 0 && (
              <p className="text-xs text-gray-500">No other channels in this group.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
