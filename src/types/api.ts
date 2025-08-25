export interface TyreAnalysisResponse {
  analysis: {
    left: {
      tread_depth: number;
      condition: string;
      wear_pattern: string;
    };
    center: {
      tread_depth: number;
      condition: string;
      wear_pattern: string;
    };
    right: {
      tread_depth: number;
      condition: string;
      wear_pattern: string;
    };
  };
  overall: {
    average_depth: number;
    condition: string;
    recommendation: string;
  };
  timestamp: string;
  frames_analyzed: number;
}