// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { parseM3U } from '../utils/m3uParser';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appInfo, setAppInfo] = useState(null);
  const [channels, setChannels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch App Config. Replace with your actual API endpoint.
        // For demonstration, we simulate fetching the JSON you provided.
        const mockConfigUrl = 'data:application/json,' + encodeURIComponent(JSON.stringify({
          app_info: {
            app_name: "Porbboi TV",
            app_logo: "https://via.placeholder.com/150",
            version: "1.0.5",
            description: "Premium Live TV Application",
            whats_new: "Added PiP mode and Background Play.",
            download_link: "https://example.com/update.apk",
            developer_name: "Developer",
            community_link: "https://t.me/your_telegram_group",
            notification_text: "Welcome to Porbboi TV! Experience premium live streaming.",
            m3u_source: "https://raw.githubusercontent.com/srhady/crichd-speical-live-event/refs/heads/main/playlist.m3u", // Using a public test list
            last_update: "2026-05-12"
          }
        }));

        const configRes = await fetch(mockConfigUrl);
        const configData = await configRes.json();
        setAppInfo(configData.app_info);

        // Step 2: Fetch M3U Source
        const m3uRes = await fetch(configData.app_info.m3u_source);
        const m3uText = await m3uRes.text();
        
        const parsedChannels = parseM3U(m3uText);
        setChannels(parsedChannels);

        // Extract unique groups
        const uniqueGroups = [...new Set(parsedChannels.map(c => c.group))];
        setGroups(['All', ...uniqueGroups]);

      } catch (err) {
        setError("Failed to load application data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ appInfo, channels, groups, loading, error }}>
      {children}
    </AppContext.Provider>
  );
};
