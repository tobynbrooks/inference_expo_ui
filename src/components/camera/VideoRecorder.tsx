import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

interface VideoRecorderProps {
  recording: any;
  onRetake: () => void;
  onContinue: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  recording,
  onRetake,
  onContinue,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: recording.uri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      </View>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>Recording Complete!</Text>
        <Text style={styles.instructionText}>
          Review your video. Make sure the tyre tread is clearly visible and well-lit.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <Text style={styles.retakeButtonText}>Retake</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: colors.text.primary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  video: {
    flex: 1,
  },
  instructionContainer: {
    marginBottom: spacing.xl,
  },
  instructionTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  instructionText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
});

export default VideoRecorder;