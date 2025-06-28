import axios from "axios";
import { getCachedData, saveDataToCache } from "./indexedDB";
import axiosInstance from './axiosInstance'

export const fetchWithCache = async (url: string) => {
    // Check if data is already cached
    const cachedData = await getCachedData(url);
    if (cachedData) {
      console.log(`Using cached data for ${url}`);
      return cachedData;
    }
  
    try {
      // Fetch from API
      const response = await axiosInstance.get(url);
      const data = await response.data;
      
      // Save response to cache
      await saveDataToCache(url, data);
      
      return data;
    } catch (error) {
      console.error(`Fetching failed for ${url}, using cache if available`, error);
      return cachedData || { error: "No internet and no cache available" };
    }
  };
  