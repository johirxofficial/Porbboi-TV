// src/utils/m3uParser.js
export const parseM3U = (m3uText) => {
  const lines = m3uText.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // চ্যানেল ইনফরমেশন পার্স করা
    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      const groupMatch = line.match(/group-title="(.*?)"/);
      
      const commaIndex = line.lastIndexOf(',');
      const name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown Channel';

      currentChannel = {
        id: Math.random().toString(36).substr(2, 9),
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1] : 'Uncategorized',
        name: name,
        referrer: '' // Referrer রাখার জন্য নতুন প্রপার্টি
      };
    } 
    // Referrer লিংক পার্স করা
    else if (line.startsWith('#EXTVLCOPT:http-referrer=')) {
      // "=" এর পরের অংশটুকু (URL) আলাদা করে নেওয়া
      currentChannel.referrer = line.substring(line.indexOf('=') + 1).trim();
    } 
    // স্ট্রিমের মেইন URL পার্স করা
    else if (line.startsWith('http')) {
      currentChannel.url = line;
      if (currentChannel.name) {
        channels.push(currentChannel);
      }
      currentChannel = {}; // পরের চ্যানেলের জন্য রিসেট
    }
  }
  return channels;
};
