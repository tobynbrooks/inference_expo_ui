import { useState, useRef, useCallback, useEffect } from 'react';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

interface CameraState {
  hasAllPermissions: boolean;
  isRecording: boolean;
  recording: any | null;
  recordingDuration: number;
  isCameraReady: boolean;
}

export const useCamera = () => {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<any>(null);
  
  const [state, setState] = useState<CameraState>({
    hasAllPermissions: false,
    isRecording: false,
    recording: null,
    recordingDuration: 0,
    isCameraReady: false,
  });

  const requestPermissions = useCallback(async () => {
    try {
      const cameraResult = await requestCameraPermission();
      const microphoneResult = await requestMicrophonePermission();
      const mediaLibraryResult = await MediaLibrary.requestPermissionsAsync();
      
      setMediaLibraryPermission(mediaLibraryResult);

      const allGranted = 
        cameraResult?.granted &&
        microphoneResult?.granted &&
        mediaLibraryResult?.granted;

      setState(prev => ({ ...prev, hasAllPermissions: allGranted }));
      return allGranted;
    } catch (error) {
      console.error('Permission request failed:', error);
      setState(prev => ({ ...prev, hasAllPermissions: false }));
      return false;
    }
  }, [requestCameraPermission, requestMicrophonePermission]);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current || state.isRecording || !state.isCameraReady) return;

    try {
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        recordingDuration: 0 
      }));

      let stopped = false;

      // Auto-stop after 5s
      const stopTimer = setTimeout(() => {
        if (cameraRef.current && !stopped) {
          cameraRef.current.stopRecording();
        }
      }, 5000);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 5,
        quality: '720p',
      });
      
      stopped = true;
      clearTimeout(stopTimer);
      
      setState(prev => ({ 
        ...prev, 
        recording: video, 
        isRecording: false 
      }));
      console.log('Recording saved to:', video?.uri);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        recordingDuration: 0 
      }));
    }
  }, [state.isRecording, state.isCameraReady]);

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

  useEffect(() => {
    const hasPermissions = 
      cameraPermission?.granted && 
      microphonePermission?.granted && 
      mediaLibraryPermission?.granted;
    
    setState(prev => ({ ...prev, hasAllPermissions: hasPermissions }));
  }, [cameraPermission, microphonePermission, mediaLibraryPermission]);

  return {
    cameraRef,
    hasAllPermissions: state.hasAllPermissions,
    isRecording: state.isRecording,
    recording: state.recording,
    recordingDuration: state.recordingDuration,
    isCameraReady: state.isCameraReady,
    startRecording,
    stopRecording,
    resetRecording,
    requestPermissions,
    setCameraReady: () => setState(prev => ({ ...prev, isCameraReady: true })),
  };
};