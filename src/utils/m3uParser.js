// src/utils/m3uParser.js
export const parseM3U = (m3uText) => {
  const lines = m3uText.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="(.*?)"/);
      const groupMatch = line.match(/group-title="(.*?)"/);
      
      // Extract name after the last comma
      const commaIndex = line.lastIndexOf(',');
      const name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown Channel';

      currentChannel = {
        // Generate a simple unique ID for routing
        id: Math.random().toString(36).substr(2, 9),
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1] : 'Uncategorized',
        name: name,
      };
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
      // Only push if we have a URL
      if (currentChannel.name) {
        channels.push(currentChannel);
      }
      currentChannel = {};
    }
  }
  return channels;
};
