# Learn by Translation

A Next.js translation app that helps users learn languages by providing detailed word-by-word analysis with grammatical roles and explanations. Powered by OpenRouter's LLM API.

## Features

- 🌍 Support for 15+ languages
- 📖 Word-by-word translation breakdown
- 🎯 Grammatical role identification for each word
- 💡 Detailed explanations to help understand usage
- 🎨 Beautiful UI with shadcn/ui components
- 🚀 Fast and responsive
- 🔒 Secure API key handling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

3. Add your OpenRouter API key to `.env.local`:

```
OPENROUTER_API_KEY=your_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter or paste the text you want to translate
2. Optionally select the source language (auto-detect by default)
3. Select your target language
4. Click "Translate & Analyze"
5. View the translation and detailed word-by-word breakdown

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zod** - Schema validation
- **OpenRouter** - LLM API for translations
- **Lucide React** - Icons

## Project Structure

```
translator/
├── app/
│   ├── api/
│   │   └── translate/
│   │       └── route.ts        # Translation API endpoint
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── translator.tsx          # Main translator component
├── lib/
│   └── utils.ts                # Utility functions
└── types/
    └── translation.ts          # Type definitions and validation
```

## API

### POST /api/translate

Translates text and provides word-by-word analysis.

**Request Body:**
```json
{
  "text": "Hello world",
  "targetLanguage": "es",
  "sourceLanguage": "en" // optional
}
```

**Response:**
```json
{
  "originalText": "Hello world",
  "translatedText": "Hola mundo",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "wordAnalysis": [
    {
      "word": "Hello",
      "translation": "Hola",
      "role": "interjection",
      "explanation": "Common greeting"
    },
    {
      "word": "world",
      "translation": "mundo",
      "role": "noun",
      "explanation": "Masculine noun meaning 'world'"
    }
  ]
}
```

## License

MIT

