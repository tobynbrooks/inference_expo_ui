import axios, { AxiosResponse } from 'axios';
import { TyreAnalysisResponse } from '../types/api';

// Local development server URL - update port if different
const API_BASE_URL = 'https://32db09ccc00a.ngrok-free.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const uploadFramesForAnalysis = async (
  frames: string[]
): Promise<TyreAnalysisResponse> => {
  console.group('🔍 Uploading frames for analysis');
  console.log('Frame count:', frames.length);
  
  // Validate we have exactly 5 frames as required by FastAPI
  if (frames.length !== 5) {
    throw new Error(`FastAPI expects exactly 5 frames, but received ${frames.length}`);
  }
  
  try {
    const formData = new FormData();
    
    // Add exactly 5 files as your FastAPI expects
    frames.forEach((frame, index) => {
      // React Native FormData - each frame as a separate file
      formData.append('files', {
        uri: frame, // Base64 data URL
        type: 'image/jpeg',
        name: `frame_${index}.jpg`,
      } as any);
    });
    
    // Calculate total size
    const totalSize = frames.reduce((acc, frame) => {
      const base64Data = frame.replace(/^data:image\/\w+;base64,/, '');
      return acc + (base64Data.length * 0.75); // Approximate byte size
    }, 0);
    
    const sizeMB = totalSize / (1024 * 1024);
    console.log('Total upload size:', sizeMB.toFixed(2), 'MB');
    
    if (sizeMB > 9) {
      throw new Error('Upload size exceeds 9MB limit. Please reduce frame quality or count.');
    }
    
    const response = await api.post('/predict', formData);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    console.log('✅ Analysis completed successfully');
    console.groupEnd();
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    console.groupEnd();
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 413) {
        throw new Error('Upload too large. Please reduce frame quality.');
      } else if (status && status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your connection.');
      } else if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    
    throw error;
  }
};

// Health check endpoint
export const checkApiHealth = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('API service unavailable');
  }
};

// Test connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await checkApiHealth();
    return true;
  } catch {
    return false;
  }
};