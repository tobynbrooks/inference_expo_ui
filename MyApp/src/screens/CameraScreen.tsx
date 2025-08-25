import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraViewComponent from '../components/camera/CameraView';
import VideoRecorder from '../components/camera/VideoRecorder';
import WizardContainer from '../components/wizard/WizardContainer';
import { useCamera } from '../hooks/useCamera';
import { colors } from '../styles/colors';

type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Processing: undefined;
  Results: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const wizardSteps = [
  { id: 'home', title: 'Welcome' },
  { id: 'camera', title: 'Record Video' },
  { id: 'processing', title: 'Processing' },
  { id: 'results', title: 'Results' },
];

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const {
    cameraRef,
    isRecording,
    recording,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
    requestPermissions,
    hasAllPermissions,
  } = useCamera();

  const handleRequestPermissions = async () => {
    await requestPermissions();
  };

  const handleRetake = () => {
    resetRecording();
  };

  const handleContinue = () => {
    navigation.navigate('Processing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <WizardContainer currentStep={2} steps={wizardSteps}>
        {recording ? (
          <VideoRecorder
            recording={recording}
            onRetake={handleRetake}
            onContinue={handleContinue}
          />
        ) : (
          <CameraViewComponent
            cameraRef={cameraRef}
            hasPermissions={hasAllPermissions}
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onRequestPermissions={handleRequestPermissions}
          />
        )}
      </WizardContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default CameraScreen;