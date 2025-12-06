# TrendSage - AI-Powered Market Trend Explorer

TrendSage is an AI-driven research assistant that helps users discover and analyze current market trends by aggregating and summarizing scholarly publications using RAG (Retrieval-Augmented Generation).

![TrendSage Screenshot](https://via.placeholder.com/800x400?text=TrendSage+AI+Market+Research)

## ✨ Features

- **🤖 AI-Powered Trend Analysis**: Get instant, credible insights from scholarly sources
- **📊 Interactive Trend Cards**: View summaries with citations, charts, and key takeaways
- **📈 Publication Trend Charts**: Visualize research publication trends over time
- **🔗 Social Sharing**: Share insights on Twitter, LinkedIn, or export as Markdown/JSON
- **📉 Analytics Dashboard**: Track usage metrics and progress towards goals
- **🔍 Discover Page**: Browse trending topics by category

## 🛠 Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **OpenAI GPT-4o** for AI summarization
- **Veritus API** for scholarly search
- **Vercel** for deployment (all-in-one)

## 📁 Project Structure

```
trendsage/
└── frontend/                    # Full-stack Next.js app
    ├── src/
    │   ├── app/
    │   │   ├── api/            # Next.js API routes
    │   │   │   ├── search/     # Search endpoints
    │   │   │   ├── discover/   # Featured topics
    │   │   │   ├── analytics/  # Analytics tracking
    │   │   │   └── health/     # Health check
    │   │   ├── analytics/      # Analytics page
    │   │   ├── discover/       # Discover page
    │   │   └── page.tsx        # Homepage
    │   ├── components/         # React components
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/
    │   │   ├── api.ts          # API client
    │   │   └── services/       # Backend services
    │   └── types/              # TypeScript types
    └── .env.local              # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/rudraymehra/TrendSage.git
cd TrendSage/frontend
npm install
```

### 2. Configure Environment

Create `.env.local` in the frontend directory:

```env
# Veritus API (Scholarly Search)
VERITUS_API_URL=https://discover.veritus.ai/api
VERITUS_API_KEY=your_veritus_api_key_here

# OpenAI API (optional - uses mock data if not set)
OPENAI_API_KEY=your_openai_api_key_here

# Environment
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: The app works with mock data if API keys aren't configured, making it perfect for demo/development.

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rudraymehra/TrendSage&root-directory=frontend)

### Manual Deploy

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `frontend`
4. Add Environment Variables:

| Variable | Description |
|----------|-------------|
| `VERITUS_API_URL` | `https://discover.veritus.ai/api` |
| `VERITUS_API_KEY` | Your Veritus API key |
| `OPENAI_API_KEY` | Your OpenAI API key (optional) |

5. Click Deploy!

## 📡 API Endpoints

All API routes are part of the Next.js app (no separate backend needed):

### Search
- `POST /api/search` - Full trend analysis with AI summary
- `GET /api/search/quick?q=query` - Quick search without AI processing
- `GET /api/search/suggestions?q=query` - Autocomplete suggestions
- `POST /api/search/regenerate` - Regenerate summary for existing docs

### Discover
- `GET /api/discover/featured` - Get featured and trending topics

### Analytics
- `GET /api/analytics?range=7d` - Get analytics summary
- `POST /api/analytics/track` - Track events (card views, shares)

### Health
- `GET /api/health` - Health check endpoint

## 🔑 API Keys

1. **Veritus API Key**: For scholarly document search
   - Sign up at [veritus.ai](https://veritus.ai) to get an API key

2. **OpenAI API Key** (Optional): For AI summarization
   - Get from [platform.openai.com](https://platform.openai.com)

## 🎨 UI Features

- **Dark Theme**: Modern, eye-friendly dark interface
- **Animated Background**: Gradient blob animations
- **Glass Morphism**: Frosted glass effects on cards
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: `⌘/Ctrl + K` to focus search

## 📊 Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `VERITUS_API_KEY` | Yes* | Scholarly search API key |
| `VERITUS_API_URL` | No | API URL (has default) |
| `OPENAI_API_KEY` | No | OpenAI API key for GPT-4o |

*Uses mock data if not provided

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Create a Pull Request

## 📄 License

MIT © TrendSage
