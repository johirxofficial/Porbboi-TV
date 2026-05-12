// src/pages/Home.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Search, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Home() {
  const { appInfo, channels, groups, loading, error } = useContext(AppContext);
  const [activeGroup, setActiveGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-400">Loading Porbboi TV...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  }

  // Filter channels
  const filteredChannels = channels.filter(channel => {
    const matchesGroup = activeGroup === 'All' || channel.group === activeGroup;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img src={appInfo.app_logo} alt="Logo" className="w-8 h-8 rounded-full bg-gray-800" />
          <h1 className="font-bold text-lg">{appInfo.app_name}</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <Info size={20} />
        </button>
      </header>

      {/* Notification Marquee */}
      <div className="px-4 pt-4">
        <div className="bg-gray-800 rounded-full overflow-hidden flex items-center h-8 px-3">
          <div className="whitespace-nowrap animate-marquee text-sm text-green-400">
            {appInfo.notification_text}
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Horizontal Category Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {groups.map((group, idx) => (
            <button
              key={idx}
              onClick={() => setActiveGroup(group)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeGroup === group ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <div className="grid grid-cols-3 gap-3">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => navigate(`/player/${channel.id}`)}
              className="bg-gray-800 rounded-xl p-3 flex flex-col items-center justify-between cursor-pointer hover:bg-gray-700 active:scale-95 transition-all aspect-square"
            >
              {channel.logo ? (
                <img src={channel.logo} alt={channel.name} className="w-12 h-12 object-contain mb-2" onError={(e) => e.target.style.display = 'none'} />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xs font-bold">{channel.name.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-xs font-bold text-center line-clamp-2 w-full leading-tight">{channel.name}</h3>
              <p className="text-[10px] text-gray-400 truncate w-full text-center mt-1">{channel.group}</p>
            </div>
          ))}
        </div>
        {filteredChannels.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">No channels found.</div>
        )}
      </div>

      {/* Info Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-6">
              <img src={appInfo.app_logo} alt="Logo" className="w-16 h-16 rounded-full bg-gray-800 mb-3" />
              <h2 className="text-xl font-bold">{appInfo.app_name}</h2>
              <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded mt-1">v{appInfo.version}</span>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <p><strong>Developer:</strong> {appInfo.developer_name}</p>
              <p><strong>Description:</strong> {appInfo.description}</p>
              <p><strong>What's New:</strong> {appInfo.whats_new}</p>
              <p><strong>Last Update:</strong> {appInfo.last_update}</p>
            </div>
            <a 
              href={appInfo.download_link} 
              target="_blank" 
              rel="noreferrer"
              className="mt-6 block w-full bg-blue-600 hover:bg-blue-700 text-center py-2.5 rounded-lg font-medium transition-colors"
            >
              Download Update
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
