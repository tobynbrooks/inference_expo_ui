import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import WizardContainer from '../components/wizard/WizardContainer';
import { useAnalysis } from '../hooks/useAnalysis';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

type RootStackParamList = {
  Home: undefined;
  Camera: { videoUri: string };
  Processing: { videoUri: string };
  Results: { analysisData: any };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

const wizardSteps = [
  { id: 'home', title: 'Welcome' },
  { id: 'camera', title: 'Record Video' },
  { id: 'processing', title: 'Processing' },
  { id: 'results', title: 'Results' },
];

const ProcessingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { videoUri } = route.params;
  const { isAnalyzing, analyzeFrames, error, checkConnection, isConnected } = useAnalysis();
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [processingStep, setProcessingStep] = useState<'connecting' | 'extracting' | 'analyzing' | 'complete'>('connecting');

  const extractFrames = async (): Promise<string[]> => {
    const frames: string[] = [];
    const videoDuration = 5000; // 5 seconds in milliseconds
    const frameCount = 5;
    const interval = videoDuration / frameCount;

    for (let i = 0; i < frameCount; i++) {
      const timeMs = i * interval;
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: timeMs,
          quality: 0.8,
        });
        
        // Convert to base64
        const response = await fetch(uri);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        
        frames.push(base64);
        console.log(`Extracted frame ${i + 1}/${frameCount} at ${timeMs}ms`);
      } catch (error) {
        console.error(`Failed to extract frame ${i}:`, error);
        throw new Error(`Failed to extract frame ${i + 1}`);
      }
    }

    return frames;
  };

  const processVideo = async () => {
    try {
      // Step 1: Check connection
      setProcessingStep('connecting');
      const connected = await checkConnection();
      if (!connected) {
        Alert.alert('Connection Error', 'Cannot connect to analysis service. Please check your internet connection.');
        return;
      }

      // Step 2: Extract frames
      setProcessingStep('extracting');
      setIsExtracting(true);
      const frames = await extractFrames();
      setExtractedFrames(frames);
      setIsExtracting(false);

      // Step 3: Analyze frames
      setProcessingStep('analyzing');
      const result = await analyzeFrames(frames);
      
      // Step 4: Navigate to results
      setProcessingStep('complete');
      if (result) {
        navigation.replace('Results', { analysisData: result });
      }
    } catch (error) {
      setIsExtracting(false);
      console.error('Processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      Alert.alert('Processing Error', errorMessage);
    }
  };

  useEffect(() => {
    if (videoUri) {
      processVideo();
    }
  }, [videoUri]);

  const getStatusText = () => {
    switch (processingStep) {
      case 'connecting':
        return 'Connecting to analysis service...';
      case 'extracting':
        return 'Extracting frames from video...';
      case 'analyzing':
        return 'Analyzing tyre tread...';
      case 'complete':
        return 'Analysis complete!';
      default:
        return 'Processing...';
    }
  };

  const getProgressText = () => {
    switch (processingStep) {
      case 'connecting':
        return isConnected === null ? 'Testing connection...' : isConnected ? 'Connected ✓' : 'Connection failed ✗';
      case 'extracting':
        return `Extracting frames... ${extractedFrames.length}/5`;
      case 'analyzing':
        return 'Analyzing frames with AI...';
      case 'complete':
        return 'Redirecting to results...';
      default:
        return '';
    }
  };

  const handleRetry = () => {
    setExtractedFrames([]);
    processVideo();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <WizardContainer currentStep={3} steps={wizardSteps}>
        <View style={styles.content}>
          <View style={styles.statusContainer}>
            <Text style={styles.title}>Processing Video</Text>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <Text style={styles.progressText}>{getProgressText()}</Text>
            
            {(isExtracting || isAnalyzing) && (
              <ActivityIndicator 
                size="large" 
                color={colors.primary} 
                style={styles.loader}
              />
            )}
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Video Preview</Text>
            <Video
              source={{ uri: videoUri }}
              style={styles.videoPreview}
              useNativeControls
              resizeMode="contain"
              shouldPlay={false}
            />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </WizardContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  previewTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  videoPreview: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  controls: {
    paddingBottom: spacing.md,
  },
  backButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
});

export default ProcessingScreen;