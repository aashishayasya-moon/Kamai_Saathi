# Kamai Saathi — Landing Page, Auth Gateway, Multi-Turn Gemini AI & Multilingual Audio Transcription Tool

An architectural roadmap to expand **Kamai Saathi** with:
1. An educational, high-impact **Landing Page**
2. A dedicated **Authentication Gateway** (Google Sign-In + Email/Password)
3. An upgraded **Multi-Turn Gemini Chatbot** for Saathi AI
4. An **AI Audio Transcription Tool** supporting direct microphone audio recording and audio file uploads across all 6 Indian languages.

---

## User Review & Critical Decisions

![Kamai Saathi Logo](image.png)

> [!IMPORTANT]
> **Summary of Newly Added Capabilities & Architectural Revisions**:
> 1. **AI Audio Transcription Tool (`/api/voice/transcribe-audio`)**:
>    - Users can now **record live audio** using the browser's `MediaRecorder` API or **upload audio clips** (`.mp3`, `.wav`, `.m4a`, `.webm`, `.ogg`).
>    - The backend uses Gemini multimodal audio processing (`gemini-3.8-flash` / `gemini-3.5-transcribe`) to transcribe spoken speech across all 6 Indian languages (**English, Hindi, Kannada, Tamil, Telugu, Marathi**) and simultaneously extract structured candidate transactions.
>    - Proposed transactions are displayed in the review card for explicit confirmation before touching the verified ledger.
> 2. **Three-Stage Experience Hierarchy**:
>    - **Landing Page**: Public showcase of Kamai Saathi's core value pillars with direct CTAs.
>    - **Auth Page**: Dedicated authentication gateway with Google Sign-In, Email/Password login & registration, and an instant demo access option.
>    - **Home Dashboard**: Protected financial workspace accessible once signed in.
> 3. **Multi-Turn Gemini Chatbot in Saathi AI**:
>    - Full conversational memory thread powered by `gemini-3.8-flash`.
>    - Context-grounded in the user's real-time balance, upcoming obligations, and active shortfall deficit.
> 4. **Official Design System & Logo**:
>    - Preserves the approved Saffron Gold (`#F59E0B`), Jade Emerald (`#10B981`), and Deep Nocturne Navy (`#0B132B`) palette and `<BrandLogo />` across all views.

---

## 1. Overview & Core Concept

### Complete End-to-End User Journey

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. PUBLIC LANDING PAGE                          │
│  • Brand Emblem & Tagline: "Money clarity. Safer choices."            │
│  • 4 Interactive Capability Spotlights (Voice, Forecast, Scam, Scheme) │
│  • 6-Language Live Audio & Speech Preview                              │
│  • Primary CTAs: [Get Started Free] / [Sign In to Your Ledger]         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Clicks CTA
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      2. AUTHENTICATION GATEWAY                         │
│  • Google Sign-In (Firebase Auth integration)                          │
│  • Email & Password (Sign In / Create Account tabs)                    │
│  • One-Click Demo Mode (Ramesh / Delivery Partner)                     │
│  • Terms & Privacy Disclosures                                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Authenticated
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      3. HOME APPLICATION DASHBOARD                     │
│  • Top Navigation (User Profile, Persona, Language, Quick Log)        │
│  • Recorded Balance, 7-Day Inflows, Upcoming Obligations               │
│  • 14-Day Shortfall Alert & Emergency Reserve Mitigation               │
│  • AI Audio Transcription Tool (Mic Record + File Upload in 6 Langs)   │
│  • Multi-Turn Saathi AI Gemini Chatbot                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. AI Audio Transcription Tool for All 6 Languages

### Architecture of the Audio Transcription Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER (VOICE LOGGER MODAL)                  │
│                                                                        │
│  Option A: Record Live Audio (MediaRecorder -> Blob audio/webm)        │
│  Option B: Upload Audio File (.mp3, .wav, .m4a, .webm, .ogg)           │
│  Option C: Live Browser SpeechRecognition (Web Speech API)             │
│  Option D: Verified Scenario Test Chips (Instant Multi-Language Demo)  │
│                                                                        │
│  Selected Language: [ English | हिन्दी | ಕನ್ನಡ | தமிழ் | తెలుగు | मराठी ] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Sends base64 audio + mimeType + lang
                                    ▼ (POST /api/voice/transcribe-audio)
┌────────────────────────────────────────────────────────────────────────┐
│               SERVER-SIDE MULTIMODAL GEMINI PIPELINE                   │
│                                                                        │
│  • Validates audio payload size (max 10MB)                             │
│  • Constructs Gemini `inlineData` part with audio base64 & MIME type   │
│  • Prompts Gemini 3.8 Flash with audio part:                          │
│    "Listen to this audio recording in <language>. Transcribe the spoken │
│     words verbatim, then extract all income and expenses into JSON:   │
│     { transcript: string, candidates: [{ type, amount, category }] }"  │
│  • Returns transcript + proposed candidates to client                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  CLIENT PROPOSED ENTRY REVIEW DRAWER                   │
│  • Displays exact audio transcript produced by Gemini                  │
│  • User inspects and confirms items before committing to ledger        │
└────────────────────────────────────────────────────────────────────────┘
```

### Supported Languages for Audio Transcription
1. **English (`en`)**: Transcribes Indian English dialects and gig platform terminologies (e.g., "payout", "surge", "trips", "petrol").
2. **Hindi (`hi`)**: Transcribes Devanagari speech (e.g., *"आज डिलीवरी से ₹1,200 मिले और ₹250 का पेट्रोल डलवाया"*).
3. **Kannada (`kn`)**: Transcribes Kannada speech (e.g., *"ಇಂದು ಡೆಲಿವರಿಯಿಂದ 1200 ರೂಪಾಯಿ ಬಂತು ಮತ್ತು 250 ರೂಪಾಯಿ ಪೆಟ್ರೋಲ್‌ಗೆ ಖರ್ಚು ಮಾಡಿದೆ"*).
4. **Tamil (`ta`)**: Transcribes Tamil speech (e.g., *"இன்று டெலிவரியில் 1200 ரூபாய் வருமானம் மற்றும் பெட்ரோலுக்கு 250 ரூபாய் செலவு"*).
5. **Telugu (`te`)**: Transcribes Telugu speech (e.g., *"ఈ రోజు డెలివరీ ద్వారా 1200 రూపాయలు సంపాదించాను మరియు పెట్రోల్ కోసం 250 ఖర్చు చేశాను"*).
6. **Marathi (`mr`)**: Transcribes Marathi speech (e.g., *"आज डिलिव्हरीमधून 1200 रुपये मिळाले आणि 250 रुपयांचे पेट्रोल भरले"*).

---

## 3. Landing Page & Authentication Gateway

### 1. Landing Page (`LandingPage.tsx`)
- **Brand Hero**: Full `<BrandLogo size="lg" />`, official tagline *"Money clarity. Safer choices."*, value metrics, and prominent "Get Started" and "Sign In" CTAs.
- **Interactive Feature Showcases**:
  - *Multilingual Audio & Voice Logging*: Interactive player previewing audio transcription across all 6 languages.
  - *14-Day Shortfall Forecaster*: Interactive visual card illustrating how irregular income dips are flagged prior to loan EMI due dates.
  - *Scam Shield Threat Analyzer*: Live card showing red-flag detection of fake instant loan APKs.
  - *Verified Welfare Schemes*: Official criteria for PM-SVANidhi, e-Shram, PMSYM, and PMJJBY.
- **Testimonials & Trust**: Security and privacy transparency statement highlighting local ledger persistence.

### 2. Authentication Gateway (`AuthPage.tsx`)
- **Google Sign-In**: Branded Google button triggering Firebase popup authentication.
- **Email & Password Form**: Tabbed "Sign In" vs "Create Account" forms with client-side validation and clear error feedback.
- **One-Click Demo User**: "Continue as Demo User (Ramesh Kumar / Delivery Partner)" button for instant, zero-friction review without requiring external credentials.
- **Navigation**: Allows users to return to the Landing Page or directly proceed to the application upon authentication.

---

## 4. Multi-Turn Gemini Chatbot in Saathi AI

- **Multi-Turn Conversation State**: Maintains full back-and-forth dialogue history (`role: 'user' | 'model'`).
- **Context Grounding**: System prompt dynamically injects real-time financial snapshots (current balance, 14-day shortfall alert, upcoming mandatory obligations).
- **Endpoint**: `POST /api/chat/saathi` accepts `history` array and returns `{ reply, assumptions, suggestedActions }`.
- **UI Enhancements**: Scrollable chat thread, empathetic persona, suggestion chips, transparent assumptions list, and offline local-only fallback.

---

## 5. Phased Implementation Roadmap

### Phase 1: Audio Transcription Server Pipeline
- Update `server.ts` with `POST /api/voice/transcribe-audio`:
  - Accepts `{ audioBase64: string, mimeType: string, language: string }`.
  - Sends multimodal inlineData to Gemini 3.8 Flash.
  - Returns `{ transcript: string, candidates: [...] }`.
  - Fallback logic to rule engine if audio API encounters temporary latency.

### Phase 2: Audio Recording & Upload UI in Voice Logger
- Update `src/components/VoiceLoggerModal.tsx`:
  - Add **Live Audio Recording** tab using `MediaRecorder` API with animated waveform visualizer.
  - Add **Audio File Upload** tab accepting `.mp3`, `.wav`, `.m4a`, `.webm`, `.ogg` files.
  - Keep Web Speech API and 6-language scenario test chips for infallible demo execution.
  - Display transcript produced by AI and proposed items in review drawer.

### Phase 3: Landing Page Implementation
- Build `src/components/LandingPage.tsx` with:
  - Hero, logo emblem, value metrics, 4 signature capability cards, 6-language audio preview, and CTAs.

### Phase 4: Authentication Gateway Implementation
- Build `src/services/authService.ts` and `src/components/AuthPage.tsx`:
  - Google Sign-In and Email/Password authentication.
  - Demo user one-click bypass.
  - Session state management and logout action.

### Phase 5: Multi-Turn Gemini Chatbot Upgrade
- Update `server.ts` `/api/chat/saathi` to receive full message history.
- Update `src/components/SaathiChatView.tsx` with continuous conversational state and scrollable message thread.

### Phase 6: Router Integration & Verification Gate
- Update `src/App.tsx` to handle page routing: `landing` $\rightarrow$ `auth` $\rightarrow$ `app`.
- Run `compile_applet` and `lint_applet` to verify zero errors.
- Test audio transcription in all 6 languages, landing page responsiveness, authentication flow, and multi-turn chat.
