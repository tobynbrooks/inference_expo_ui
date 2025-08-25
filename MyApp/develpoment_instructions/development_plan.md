Tyre Analysis MVP - Project Plan
Project Overview
A mobile-first app that allows users to record a video of their tyre tread, automatically extracts 5 frames, sends them to a FastAPI backend for AI analysis, and displays the results in a wizard format.
Tech Stack
Frontend: React Native with Expo (TypeScript)
Backend: Grok and curl (Python) - Already built
Camera: Expo Camera
Video Processing: HTML5 Canvas API
HTTP Client: Axios
Navigation: React Navigation

File Structure
TyreAnalysisApp/
├── App.tsx                          # Main entry point
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── expo-env.d.ts                    # Expo TypeScript definitions
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx          # Custom button component
│   │   │   ├── LoadingSpinner.tsx  # Loading indicator
│   │   │   └── ProgressBar.tsx     # Wizard progress indicator
│   │   ├── camera/
│   │   │   ├── CameraView.tsx      # Camera component
│   │   │   └── VideoRecorder.tsx   # Video recording logic
│   │   ├── analysis/
│   │   │   ├── ResultsDisplay.tsx  # Analysis results component
│   │   │   └── TreadGauge.tsx      # Tread depth gauge
│   │   └── wizard/
│   │       ├── WizardContainer.tsx # Wizard wrapper
│   │       └── StepIndicator.tsx   # Step progress indicator
│   │
│   ├── screens/                     # App screens
│   │   ├── HomeScreen.tsx          # Welcome/start screen
│   │   ├── CameraScreen.tsx        # Video recording screen
│   │   ├── ProcessingScreen.tsx    # Frame extraction & upload
│   │   └── ResultsScreen.tsx       # Analysis results
│   │
│   ├── services/                    # API and external services
│   │   ├── api.ts                  # grok curl client
│   │   ├── videoProcessor.ts       # Frame extraction logic
│   │   └── cameraService.ts        # Camera utilities
│   │
│   ├── types/                       # TypeScript definitions
│   │   ├── api.ts                  # API response types
│   │   ├── camera.ts               # Camera-related types
│   │   └── analysis.ts             # Analysis result types
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useCamera.ts            # Camera state management
│   │   ├── useVideoProcessor.ts    # Video processing hook
│   │   └── useAnalysis.ts          # Analysis API hook
│   │
│   ├── utils/                       # Utility functions
│   │   ├── constants.ts            # App constants
│   │   ├── validation.ts           # Input validation
│   │   └── helpers.ts              # General helpers
│   │
│   └── styles/                      # Styling
│       ├── colors.ts               # Color palette
│       ├── typography.ts           # Text styles
│       └── spacing.ts              # Layout spacing
│
├── assets/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── docs/                           # Documentation
    ├── API.md                      # API documentation (GROK and CURL during setup)
    └── DEVELOPMENT.md              # Development guide


Development Phases
Phase 1: Project Setup & Navigation 
Goal: Set up basic app structure with navigation
Tasks:
Initialize Expo project with TypeScript template
Install required dependencies
Set up React Navigation between 4 screens
Create basic screen components (empty for now)
Implement wizard-style navigation flow
Files to Create:
App.tsx - Navigation setup
src/screens/*.tsx - All 4 screen files
src/components/wizard/WizardContainer.tsx
src/components/wizard/StepIndicator.tsx
Success Criteria: User can navigate through all 4 screens in sequence

Phase 2: Camera Integration 
Goal: Implement video recording functionality
Tasks:
Set up Expo Camera permissions
Create camera component with record functionality
Implement video recording with 5-second limit
Add camera controls (record/stop/retake)
Save video to device temporarily
Files to Create:
src/components/camera/CameraView.tsx
src/components/camera/VideoRecorder.tsx
src/hooks/useCamera.ts
src/services/cameraService.ts
Success Criteria: User can record a 5-second video and see preview

Phase 3: Video Processing 
Goal: Extract 5 frames from recorded video
Tasks:
Adapt existing frame extraction logic for React Native
Create video processing component
Display extracted frames to user for confirmation
Implement frame quality validation
Add retry functionality if frames are poor quality
Files to Create:
src/services/videoProcessor.ts (adapt existing code)
src/hooks/useVideoProcessor.ts
src/components/analysis/FramePreview.tsx
Success Criteria: Video is automatically split into 5 high-quality frames

Phase 4: API Integration
Goal: Connect to FastAPI backend for analysis
Tasks:
Set up API client with proper configuration
Create upload service for frames
Implement error handling and retry logic
Add loading states during upload/analysis
Handle API response parsing
Files to Create:
src/services/api.ts
src/hooks/useAnalysis.ts
src/types/api.ts
src/components/common/LoadingSpinner.tsx
Success Criteria: Frames are uploaded and analysis results received

Phase 5: Results Display 
Goal: Show analysis results in simple, clear format
Tasks:
Create simple results display showing three zones
Display prediction values for left, center, right
Add visual indicators for each zone (good/warning/bad)
Add action buttons (restart analysis, save results)
Implement proper error states
Files to Create:
src/components/analysis/ResultsDisplay.tsx (simple 3-zone display)
src/components/analysis/ZoneIndicator.tsx (individual zone component)
src/screens/ResultsScreen.tsx
Success Criteria: Analysis results displayed showing predictions for all three zones

Key Components to Build
1. WizardContainer Component
// src/components/wizard/WizardContainer.tsx
interface WizardStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

const steps: WizardStep[] = [
  { id: 'home', title: 'Welcome', component: HomeScreen },
  { id: 'camera', title: 'Record Video', component: CameraScreen },
  { id: 'processing', title: 'Processing', component: ProcessingScreen },
  { id: 'results', title: 'Results', component: ResultsScreen },
];

2. Video Processor Service
// src/services/videoProcessor.ts
// Adapt the existing extractVideoFrames function for React Native
// Use expo-av or react-native-video for video manipulation

3. API Client
// src/services/api.ts
const API_BASE_URL = 'https://your-fastapi-url.com';

export const uploadFramesForAnalysis = async (frames: string[]) => {
  // Upload 5 frames to FastAPI backend
  // Handle multipart/form-data upload
  // Return parsed analysis results
};


Configuration Files
Dependencies to Install
# Core navigation
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

# Camera and video
npx expo install expo-camera expo-av expo-media-library

# HTTP client
npm install axios

# Additional utilities
npm install react-hook-form
npx expo install expo-file-system

Expo Configuration (app.json)
{
  "expo": {
    "name": "Tyre Analysis",
    "slug": "tyre-analysis-app",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "permissions": [
      "CAMERA",
      "RECORD_AUDIO",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}


Development Guidelines
Code Standards
Use TypeScript for all files
Follow React Native best practices
Use functional components with hooks
Implement proper error boundaries
Add loading states for all async operations
Testing Strategy
Test on physical device (camera functionality)
Test with various video lengths and qualities
Test error scenarios (network failures, poor video quality)
Test on both iOS and Android
Performance Considerations
Limit video length to prevent large file sizes
Compress frames before upload
Implement proper cleanup of temporary files
Use React.memo for expensive components

API Integration Notes
FastAPI Endpoint Expected
POST /analyze-tyre
Content-Type: multipart/form-data

Body:
- files[]: Array of 5 
- metadata: JSON with video info

Expected Response Format
interface TyreAnalysisResponse {
  predictions: {
    left: number;
    center: number;
    right: number;
  };
  session_id: string;
  cloudinary_urls: {
    left: string[];
    center: string[];
    right: string[];
  };
  total_zone_images_uploaded: number;
  results_json_url?: string;
}


Deployment Checklist
Before Submission
[ ] All screens functional and connected
[ ] Camera permissions working
[ ] Video recording and frame extraction working
[ ] API integration complete with error handling
[ ] Results display showing all analysis data
[ ] App tested on physical device
[ ] Loading states and error messages implemented
[ ] Code documented and cleaned up


