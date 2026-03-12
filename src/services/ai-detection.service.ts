import { logInfo, logWarning } from '../utils/logger';

const DISEASE_LABELS = ['Healthy', 'FMD_Suspected', 'FMD_Confirmed', 'Other_Lesion'];

/**
 * AI Detection Service — stub implementation.
 * In production, integrate a real TensorFlow Serving endpoint or
 * install @tensorflow/tfjs-node (requires native C++ build tools).
 * This stub returns a placeholder result so the rest of the platform works.
 */
export class AIDetectionService {
    private modelLoaded = false;

    async loadModel(): Promise<void> {
        logWarning('AI model stub: no real model loaded. Provide AI_MODEL_URL env var to connect to an inference server.');
        this.modelLoaded = true;
    }

    async detectDisease(_imageBuffer: Buffer): Promise<{
        prediction: string;
        confidence: number;
        probabilities: Record<string, number>;
    }> {
        // In a real deployment this would call a TF Serving / ML endpoint
        logInfo('AI detection stub called — returning placeholder result');

        const probabilities: Record<string, number> = {};
        DISEASE_LABELS.forEach((label) => {
            probabilities[label] = 0;
        });
        probabilities['model_not_deployed'] = 1;

        return {
            prediction: 'model_not_deployed',
            confidence: 0,
            probabilities,
        };
    }

    isModelLoaded(): boolean {
        return this.modelLoaded;
    }
}