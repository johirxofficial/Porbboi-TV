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
        setError(null);

        // Step 1: Fetch App Config from your live API source
        const configUrl = 'https://johirxofficial.iam.bd/api/Porbboi%20TV/config.json';
        const configRes = await fetch(configUrl);
        
        if (!configRes.ok) {
          throw new Error(`Failed to load app configuration. Status: ${configRes.status}`);
        }
        
        const configData = await configRes.json();
        setAppInfo(configData.app_info);

        // Step 2: Fetch M3U Source using the URL from the JSON
        if (!configData.app_info || !configData.app_info.m3u_source) {
          throw new Error("M3U source URL is missing from the configuration JSON.");
        }

        const m3uRes = await fetch(configData.app_info.m3u_source);
        
        if (!m3uRes.ok) {
          throw new Error(`Failed to load M3U playlist. Status: ${m3uRes.status}`);
        }
        
        const m3uText = await m3uRes.text();
        
        // Parse the M3U text into channel objects
        const parsedChannels = parseM3U(m3uText);
        setChannels(parsedChannels);

        // Extract unique groups for the category tabs
        const uniqueGroups = [...new Set(parsedChannels.map(c => c.group))];
        setGroups(['All', ...uniqueGroups]);

      } catch (err) {
        setError("Failed to load application data. Please check your internet connection or API source.");
        console.error("Data Fetch Error:", err);
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
