import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Function to get the Spotify access token
async function getSpotifyToken() {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    throw error;
  }
}

async function fetchPlaylist(): Promise<any> {
  try {
    const token = await getSpotifyToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

async function fetchAlbums(): Promise<any> {
  try {
    const token = await getSpotifyToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export { fetchPlaylist, fetchAlbums };
