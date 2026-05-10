import axios from "axios";
import { Platform } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadDocument = async (file: any) => {
  const formData = new FormData();
  
  if (Platform.OS === "web") {
    // On web, we use the File object directly if available
    formData.append("file", file.file || file);
  } else {
    // On mobile, we use the URI hack
    // @ts-ignore
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/pdf",
    });
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const askQuestion = async (question: string, collectionName: string) => {
  try {
    const response = await api.post("/api/chat/ask", {
      question,
      collectionName,
    });
    return response.data;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export default api;
