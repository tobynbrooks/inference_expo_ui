import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Processing: undefined;
  Results: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tyre Analysis</Text>
        <Text style={styles.subtitle}>
          Record a video of your tyre tread to get instant analysis
        </Text>
        
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How it works:</Text>
          <Text style={styles.instructionText}>1. Record a 5-second video of your tyre tread</Text>
          <Text style={styles.instructionText}>2. We'll extract frames and analyze them</Text>
          <Text style={styles.instructionText}>3. Get results for left, center, and right zones</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.buttonText}>Start Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  instructions: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    width: '100%',
  },
  instructionTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  instructionText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default HomeScreen;