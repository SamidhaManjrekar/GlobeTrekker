import axios from "axios";

const API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

export const getImage = async (destination) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${destination}&page=1&per_page=1&orientation=landscape&client_id=${API_KEY}`
    );

    if (response.data.results.length > 0) {
      const url = response.data.results[0].urls.small;
      const imageUrl = url.split("?")[0]; 
      return { url: imageUrl }; 
    }
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
  }
  return { url: "https://via.placeholder.com/600x400" };
};