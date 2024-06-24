import axios from "axios";
import { flag, code, name, countries } from "country-emoji";

interface ITrackNameArtistPreviewUrl {
  trackNameAndArtist: string;
  previewUrl: string;
}

function formatAuthHeader(token: string) {
  return { Authorization: "Bearer " + token };
}

export async function getCountriesService() {
  const countryEmojisAndNames = Object.keys(countries).map((country, index) => {
    return { value: index + 1, label: flag(country) + " " + name(country) };
  });
  return countryEmojisAndNames;
}

export async function getTokenService() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const url = "https://accounts.spotify.com/api/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const data = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

  try {
    const result = await axios.post(url, data, { headers });
    if (result.status === 200) {
      const jsonResult = result.data;
      return jsonResult.access_token;
    } else {
      throw new Error(
        "Invalid access token, check your client credentials encoding and/or request method."
      );
    }
  } catch (error) {
    console.error("getTokenService error: ", error);
    return "";
  }
}

export async function getPlaylistInfoService(country: string) {
  const newToken = await getTokenService();
  const url = "https://api.spotify.com/v1/search";
  const newCountry = country.toLowerCase();

  const query = `q=top50${newCountry}&type=playlist&limit=1`;
  const queryUrl = `${url}?${query}`;

  try {
    const result = await axios.get(queryUrl, {
      headers: formatAuthHeader(newToken),
    });
    const jsonResult = result.data.playlists.items[0];

    if (!jsonResult) {
      throw new Error("No playlist was returned by the query.");
    }

    return {
      name: jsonResult.name,
      id: jsonResult.id,
      images: jsonResult.images,
    };
  } catch (error) {
    throw new Error("No playlist was returned by the query.");
  }
}

export async function getPlaylistTracksService(playlistId: string) {
  const newToken = await getTokenService();
  const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

  try {
    const result = await axios.get(url, {
      headers: formatAuthHeader(newToken),
    });
    const jsonResult = result.data.tracks.items;

    if (!jsonResult.length) {
      throw new Error("This playlist is empty.");
    }

    const trackNameArtistPreviewUrl: ITrackNameArtistPreviewUrl[] = [];

    for (let i = 0; i < 10; i++) {
      const track = jsonResult[i].track;
      trackNameArtistPreviewUrl.push({
        trackNameAndArtist: `${track.artists[0].name} - ${track.name}`,
        previewUrl: track.preview_url,
      });
    }

    return trackNameArtistPreviewUrl;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`HTTP error occurred: ${error.response.status}`);
    } else {
      throw new Error("An error occurred while fetching the playlist tracks.");
    }
  }
}
