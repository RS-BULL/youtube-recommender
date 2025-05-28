export default async function handler(req, res) {
  const { endpoint, query, videoIds, key } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY; // Set in Vercel dashboard
  const SECRET_KEY = 'Vladivostock786'; // Replace with your own secret key

  // Validate the secret key to prevent unauthorized access
  if (key !== SECRET_KEY) {
    return res.status(403).json({ error: 'Invalid key' });
  }

  let url = '';
  if (endpoint === 'search') {
    url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=50&key=${API_KEY}`;
  } else if (endpoint === 'videos') {
    url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
  } else {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message || 'Failed to fetch from YouTube API');
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}