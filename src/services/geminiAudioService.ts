import { Language, TransactionCategory } from '../types';
import { rupeesToPaise } from './calculator';

export interface StructuredTransactionCandidate {
  type: 'income' | 'expense';
  amount: number;
  amountPaise: number;
  category: TransactionCategory;
  description: string;
  confidence: number;
}

export interface AudioTranscriptionResponse {
  transcript: string;
  languageDetected: string;
  candidates: StructuredTransactionCandidate[];
  source: string;
}

export interface RecordingSession {
  mediaRecorder: MediaRecorder;
  stream: MediaStream;
  stop: () => Promise<Blob>;
}

class GeminiAudioService {
  private activeStream: MediaStream | null = null;
  private activeRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  /**
   * Check if microphone recording is supported in the current environment
   */
  isMicrophoneSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  /**
   * Start recording microphone audio
   */
  async startRecording(): Promise<void> {
    if (!this.isMicrophoneSupported()) {
      throw new Error('Microphone audio recording is not supported in this browser environment.');
    }

    // Stop any existing stream
    this.cleanupActiveStream();

    this.audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
      },
    });
    this.activeStream = stream;

    // Determine supported MIME type
    const mimeType = this.getSupportedMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    recorder.start(250); // Collect slice every 250ms
    this.activeRecorder = recorder;
  }

  /**
   * Stop active microphone recording and return the recorded Blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.activeRecorder) {
        reject(new Error('No active audio recording found to stop.'));
        return;
      }

      const recorder = this.activeRecorder;

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.cleanupActiveStream();
        resolve(audioBlob);
      };

      recorder.onerror = (event: any) => {
        this.cleanupActiveStream();
        reject(new Error(event?.error?.message || 'Recording error occurred.'));
      };

      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    });
  }

  /**
   * Helper to clean up audio stream tracks
   */
  private cleanupActiveStream(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }
    this.activeRecorder = null;
  }

  /**
   * Get supported browser audio mime type
   */
  private getSupportedMimeType(): string | undefined {
    if (typeof MediaRecorder === 'undefined') return undefined;
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
    ];
    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  }

  /**
   * Convert an audio Blob to a Base64 string
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Strip data:audio/xxx;base64, prefix
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read audio blob as base64.'));
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Transcribe microphone audio Blob using the Gemini API endpoint across all 6 supported languages:
   * 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr'
   *
   * Returns structured financial transaction proposals.
   */
  async transcribeAudioBlob(
    audioBlob: Blob,
    language: Language = 'en'
  ): Promise<AudioTranscriptionResponse> {
    const audioBase64 = await this.blobToBase64(audioBlob);
    const mimeType = audioBlob.type || 'audio/webm';

    const response = await fetch('/api/voice/transcribe-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioBase64,
        mimeType,
        language,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Audio transcription failed with HTTP status ${response.status}`);
    }

    const data = await response.json();
    return this.normalizeTranscriptionResponse(data, language);
  }

  /**
   * Transcribe simulated or pre-recorded speech text via the Gemini API
   * for reliable demo testing in all six languages without requiring mic permissions
   */
  async transcribeSampleAudio(
    sampleText: string,
    language: Language = 'en'
  ): Promise<AudioTranscriptionResponse> {
    const response = await fetch('/api/voice/transcribe-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sampleText,
        language,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Audio transcription failed with HTTP status ${response.status}`);
    }

    const data = await response.json();
    return this.normalizeTranscriptionResponse(data, language);
  }

  /**
   * Ensure candidates strictly conform to StructuredTransactionCandidate with integer paise
   */
  private normalizeTranscriptionResponse(
    data: any,
    defaultLanguage: Language
  ): AudioTranscriptionResponse {
    const validCategories: TransactionCategory[] = [
      'delivery',
      'trips',
      'salary',
      'daily_wages',
      'sales',
      'fuel',
      'groceries',
      'food',
      'rent',
      'emi',
      'medical',
      'utilities',
      'education',
      'savings',
      'other',
    ];

    const rawCandidates: any[] = Array.isArray(data.candidates) ? data.candidates : [];

    const candidates: StructuredTransactionCandidate[] = rawCandidates.map((c: any) => {
      const rawCategory = (c.category || 'delivery').toLowerCase();
      const category: TransactionCategory = validCategories.includes(rawCategory)
        ? rawCategory
        : 'other';

      const amount = Math.abs(Number(c.amount) || 0);

      return {
        type: c.type === 'expense' ? 'expense' : 'income',
        amount,
        amountPaise: rupeesToPaise(amount),
        category,
        description: String(c.description || (c.type === 'expense' ? 'Expense' : 'Income')),
        confidence: Math.min(Math.max(Number(c.confidence) || 0.9, 0.5), 0.99),
      };
    });

    return {
      transcript: String(data.transcript || ''),
      languageDetected: String(data.languageDetected || defaultLanguage),
      candidates,
      source: String(data.source || 'gemini_multimodal_audio'),
    };
  }
}

// Export singleton instance
export const geminiAudioService = new GeminiAudioService();
export default geminiAudioService;
