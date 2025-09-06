import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import WizardContainer from '../components/wizard/WizardContainer';
import { TyreAnalysisResponse } from '../types/api';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

type RootStackParamList = {
  Home: undefined;
  Camera: { videoUri: string };
  Processing: { videoUri: string };
  Results: { analysisData: TyreAnalysisResponse };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const wizardSteps = [
  { id: 'home', title: 'Welcome' },
  { id: 'camera', title: 'Record Video' },
  { id: 'processing', title: 'Processing' },
  { id: 'results', title: 'Results' },
];

const ResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { analysisData } = route.params;

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'good':
        return colors.success;
      case 'fair':
        return colors.warning;
      case 'poor':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'good':
        return 'check-circle';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'help';
    }
  };

  const formatTreadDepth = (depth: number) => {
    return `${depth.toFixed(1)}mm`;
  };

  const handleStartOver = () => {
    navigation.navigate('Home');
  };

  const handleAnalyzeAnother = () => {
    navigation.navigate('Camera');
  };

  const handleShare = () => {
    Alert.alert('Share Results', 'Sharing functionality will be implemented soon.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <WizardContainer currentStep={4} steps={wizardSteps}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Analysis Results</Text>
            <Text style={styles.subtitle}>
              Analysis completed on {new Date(analysisData.timestamp).toLocaleDateString()}
            </Text>
          </View>

          {/* Overall Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons 
                name={getConditionIcon(analysisData.overall.condition)} 
                size={24} 
                color={getConditionColor(analysisData.overall.condition)} 
              />
              <Text style={styles.cardTitle}>Overall Condition</Text>
            </View>
            <Text style={[styles.conditionText, { color: getConditionColor(analysisData.overall.condition) }]}>
              {analysisData.overall.condition.toUpperCase()}
            </Text>
            <Text style={styles.averageDepth}>
              Average Depth: {formatTreadDepth(analysisData.overall.average_depth)}
            </Text>
            <Text style={styles.recommendation}>
              {analysisData.overall.recommendation}
            </Text>
          </View>

          {/* Detailed Analysis */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            
            {/* Left Zone */}
            <View style={styles.zoneCard}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneTitle}>Left Zone</Text>
                <MaterialIcons 
                  name={getConditionIcon(analysisData.analysis.left.condition)} 
                  size={20} 
                  color={getConditionColor(analysisData.analysis.left.condition)} 
                />
              </View>
              <View style={styles.zoneDetails}>
                <Text style={styles.zoneMetric}>
                  Tread Depth: {formatTreadDepth(analysisData.analysis.left.tread_depth)}
                </Text>
                <Text style={[styles.zoneCondition, { color: getConditionColor(analysisData.analysis.left.condition) }]}>
                  {analysisData.analysis.left.condition}
                </Text>
                <Text style={styles.zoneWear}>
                  Wear Pattern: {analysisData.analysis.left.wear_pattern}
                </Text>
              </View>
            </View>

            {/* Center Zone */}
            <View style={styles.zoneCard}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneTitle}>Center Zone</Text>
                <MaterialIcons 
                  name={getConditionIcon(analysisData.analysis.center.condition)} 
                  size={20} 
                  color={getConditionColor(analysisData.analysis.center.condition)} 
                />
              </View>
              <View style={styles.zoneDetails}>
                <Text style={styles.zoneMetric}>
                  Tread Depth: {formatTreadDepth(analysisData.analysis.center.tread_depth)}
                </Text>
                <Text style={[styles.zoneCondition, { color: getConditionColor(analysisData.analysis.center.condition) }]}>
                  {analysisData.analysis.center.condition}
                </Text>
                <Text style={styles.zoneWear}>
                  Wear Pattern: {analysisData.analysis.center.wear_pattern}
                </Text>
              </View>
            </View>

            {/* Right Zone */}
            <View style={styles.zoneCard}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneTitle}>Right Zone</Text>
                <MaterialIcons 
                  name={getConditionIcon(analysisData.analysis.right.condition)} 
                  size={20} 
                  color={getConditionColor(analysisData.analysis.right.condition)} 
                />
              </View>
              <View style={styles.zoneDetails}>
                <Text style={styles.zoneMetric}>
                  Tread Depth: {formatTreadDepth(analysisData.analysis.right.tread_depth)}
                </Text>
                <Text style={[styles.zoneCondition, { color: getConditionColor(analysisData.analysis.right.condition) }]}>
                  {analysisData.analysis.right.condition}
                </Text>
                <Text style={styles.zoneWear}>
                  Wear Pattern: {analysisData.analysis.right.wear_pattern}
                </Text>
              </View>
            </View>
          </View>

          {/* Analysis Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Analysis Information</Text>
            <Text style={styles.infoText}>
              Frames Analyzed: {analysisData.frames_analyzed}
            </Text>
            <Text style={styles.infoText}>
              Analysis ID: {analysisData.timestamp}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAnalyzeAnother}>
              <MaterialIcons name="videocam" size={20} color={colors.text.inverse} />
              <Text style={styles.primaryButtonText}>Analyze Another</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
                <MaterialIcons name="share" size={20} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Share Results</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleStartOver}>
                <MaterialIcons name="home" size={20} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Start Over</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  conditionText: {
    ...typography.heading1,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  averageDepth: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  recommendation: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  zoneCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  zoneTitle: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  zoneDetails: {
    gap: spacing.sm,
  },
  zoneMetric: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  zoneCondition: {
    ...typography.body,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  zoneWear: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  actions: {
    paddingBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.body,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing.xs,
  },
  secondaryButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default ResultsScreen;