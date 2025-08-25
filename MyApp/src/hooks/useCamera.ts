import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

interface CameraState {
  hasAllPermissions: boolean;
  isRecording: boolean;
  recording: any | null;
  recordingDuration: number;
}

export const useCamera = () => {
  const cameraRef = useRef<Camera>(null);
  const [state, setState] = useState<CameraState>({
    hasAllPermissions: false,
    isRecording: false,
    recording: null,
    recordingDuration: 0,
  });

  const requestPermissions = useCallback(async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      const allGranted = 
        cameraPermission.status === 'granted' &&
        microphonePermission.status === 'granted' &&
        mediaLibraryPermission.status === 'granted';

      setState(prev => ({ ...prev, hasAllPermissions: allGranted }));
      return allGranted;
    } catch (error) {
      console.error('Permission request failed:', error);
      setState(prev => ({ ...prev, hasAllPermissions: false }));
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current || state.isRecording) return;

    try {
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        recordingDuration: 0 
      }));

      const recording = await cameraRef.current.recordAsync({
        quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: 5,
      });

      setState(prev => ({ 
        ...prev, 
        recording, 
        isRecording: false 
      }));

      console.log('Recording saved to:', recording.uri);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        recordingDuration: 0 
      }));
    }
  }, [state.isRecording]);

  const stopRecording = useCallback(() => {
    if (cameraRef.current && state.isRecording) {
      cameraRef.current.stopRecording();
    }
  }, [state.isRecording]);

  const resetRecording = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      recording: null, 
      recordingDuration: 0 
    }));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isRecording) {
      interval = setInterval(() => {
        setState(prev => ({ 
          ...prev, 
          recordingDuration: prev.recordingDuration + 100 
        }));
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRecording]);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return {
    cameraRef,
    hasAllPermissions: state.hasAllPermissions,
    isRecording: state.isRecording,
    recording: state.recording,
    recordingDuration: state.recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
    requestPermissions,
  };
};