import { useState, useCallback } from 'react';
import { TyreAnalysisResponse } from '../types/api';
import { uploadFramesForAnalysis, testConnection } from '../services/api';

interface AnalysisState {
  isAnalyzing: boolean;
  analysis: TyreAnalysisResponse | null;
  error: string | null;
  isConnected: boolean | null;
}

export const useAnalysis = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    analysis: null,
    error: null,
    isConnected: null,
  });

  const resetAnalysis = useCallback(() => {
    setState({
      isAnalyzing: false,
      analysis: null,
      error: null,
      isConnected: null,
    });
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const connected = await testConnection();
      setState(prev => ({ ...prev, isConnected: connected }));
      return connected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        error: errorMessage 
      }));
      return false;
    }
  }, []);

  const analyzeFrames = useCallback(async (frames: string[]): Promise<TyreAnalysisResponse | null> => {
    console.log('🔍 Starting analysis with', frames.length, 'frames');
    
    setState(prev => ({
      ...prev,
      isAnalyzing: true,
      error: null,
      analysis: null,
    }));

    try {
      const connected = await testConnection();
      setState(prev => ({ ...prev, isConnected: connected }));
      
      if (!connected) {
        throw new Error('Cannot connect to analysis service. Please check your internet connection.');
      }

      if (!frames || frames.length === 0) {
        throw new Error('No frames provided for analysis');
      }

      const result = await uploadFramesForAnalysis(frames);
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysis: result,
        error: null,
      }));

      console.log('✅ Analysis completed successfully');
      return result;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Analysis failed. Please try again.';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage,
        analysis: null,
      }));
      
      throw error;
    }
  }, []);

  const retryAnalysis = useCallback(async (frames: string[]): Promise<TyreAnalysisResponse | null> => {
    resetAnalysis();
    return analyzeFrames(frames);
  }, [analyzeFrames, resetAnalysis]);

  return {
    isAnalyzing: state.isAnalyzing,
    analysis: state.analysis,
    error: state.error,
    isConnected: state.isConnected,
    analyzeFrames,
    retryAnalysis,
    checkConnection,
    resetAnalysis,
  };
};