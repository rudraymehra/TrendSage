# TrendSage - AI-Powered Market Trend Explorer

TrendSage is an AI-driven research assistant that helps users discover and analyze current market trends by aggregating and summarizing scholarly publications using RAG (Retrieval-Augmented Generation).

## Features

- **AI-Powered Trend Analysis**: Get instant, credible insights from scholarly sources
- **Interactive Trend Cards**: View summaries with citations, charts, and key takeaways
- **Publication Trend Charts**: Visualize research publication trends over time
- **Social Sharing**: Share insights on Twitter, LinkedIn, or export as Markdown/JSON
- **Analytics Dashboard**: Track usage metrics and progress towards goals
- **Discover Page**: Browse trending topics by category

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Chart.js** (custom canvas implementation) for visualizations

### Backend
- **Node.js/Express** API server
- **OpenAI GPT-4o** for AI summarization
- **Veritus API** for scholarly search
- **MongoDB** (optional) for persistence

## Project Structure

```
trendsage/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API client & utilities
│   │   └── types/         # TypeScript types
│   └── .env.local         # Frontend environment
│
├── backend/               # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── index.js       # Server entry
│   └── .env               # Backend environment
│
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone and Install

```bash
cd trendsage

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Add your API keys
VERITUS_API_KEY=your_veritus_key
OPENAI_API_KEY=your_openai_key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Servers

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Search
- `POST /api/search` - Full trend analysis with AI summary
- `GET /api/search/quick?q=query` - Quick search without AI processing
- `GET /api/search/suggestions?q=query` - Autocomplete suggestions
- `POST /api/search/regenerate` - Regenerate summary for existing docs

### Trending
- `GET /api/trending` - Get trending topics
- `GET /api/trending/featured` - Get featured topics for homepage
- `GET /api/trending/categories` - Get topics by category
- `GET /api/trending/chart/:topic` - Get publication trend chart data

### Analytics
- `GET /api/analytics/summary?range=7d` - Get analytics summary
- `GET /api/analytics/goal-progress` - Track 69-user goal
- `POST /api/analytics/card-view` - Track card view event
- `POST /api/analytics/share` - Track share event

## API Keys Required

1. **Veritus API Key**: For scholarly document search
   - Sign up at veritus.ai to get an API key

2. **OpenAI API Key**: For AI summarization
   - Get from platform.openai.com

> **Note**: The app works with mock data if API keys aren't configured, making it perfect for demo/development.

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Deploy using your preferred platform
```

## Environment Variables Summary

| Variable | Location | Description |
|----------|----------|-------------|
| `PORT` | Backend | Server port (default: 3001) |
| `FRONTEND_URL` | Backend | CORS allowed origin |
| `VERITUS_API_KEY` | Backend | Scholarly search API key |
| `OPENAI_API_KEY` | Backend | OpenAI API key for GPT-4o |
| `MONGODB_URI` | Backend | Optional MongoDB connection |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API URL |

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
