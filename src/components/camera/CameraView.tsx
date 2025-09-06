import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView as ExpoCameraView, CameraType } from 'expo-camera';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

interface CameraViewProps {
  cameraRef: React.RefObject<any>;
  hasPermissions: boolean;
  isRecording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRequestPermissions: () => void;
  onCameraReady: () => void;
  isCameraReady: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraRef,
  hasPermissions,
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  onRequestPermissions,
  onCameraReady,
  isCameraReady,
}) => {
  const formatDuration = (duration: number) => {
    const seconds = Math.floor(duration / 1000);
    const milliseconds = Math.floor((duration % 1000) / 100);
    return `${seconds}.${milliseconds}s`;
  };

  if (!hasPermissions) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          We need access to your camera and microphone to record video for tyre analysis.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={onRequestPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={onCameraReady}
        mode="video"
      >
        <View style={styles.overlay}>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                Recording {formatDuration(recordingDuration)} / 5.0s
              </Text>
            </View>
          )}
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Position the tyre tread in the frame and record for 5 seconds
            </Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? onStopRecording : onStartRecording}
              disabled={isRecording || !isCameraReady}
            >
              <View style={[
                styles.recordButtonInner,
                isRecording && styles.recordButtonInnerActive,
              ]} />
            </TouchableOpacity>
          </View>
        </View>
      </ExpoCameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginRight: spacing.sm,
  },
  recordingText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  instructionText: {
    ...typography.body,
    color: colors.text.inverse,
    textAlign: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  controls: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.text.inverse,
  },
  recordButtonActive: {
    borderColor: colors.error,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.error,
  },
  recordButtonInnerActive: {
    borderRadius: 8,
    width: 32,
    height: 32,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  permissionTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  permissionButtonText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
});

export default CameraView;