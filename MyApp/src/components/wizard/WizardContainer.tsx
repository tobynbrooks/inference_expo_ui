import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepIndicator from './StepIndicator';
import { colors } from '../../styles/colors';

interface WizardStep {
  id: string;
  title: string;
}

interface WizardContainerProps {
  currentStep: number;
  steps: WizardStep[];
  children: React.ReactNode;
}

const WizardContainer: React.FC<WizardContainerProps> = ({
  currentStep,
  steps,
  children,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StepIndicator currentStep={currentStep} steps={steps} />
      <View style={styles.content}>
        {children}
      </View>
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
  },
});

export default WizardContainer;