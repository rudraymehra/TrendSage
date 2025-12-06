import express from 'express';
import { searchDocuments } from '../services/veritusService.js';
import { generateTrendSummary, generateSubTopics } from '../services/llmService.js';
import { trackSearch, getPublicationTrend } from '../services/analyticsService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Input sanitization helper
const sanitizeQuery = (query) => {
  if (typeof query !== 'string') return '';
  return query
    .trim()
    .slice(0, 500) // Max 500 characters
    .replace(/[<>]/g, '') // Remove HTML-like characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * POST /api/search
 * Main search endpoint - fetches documents and generates AI summary
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { query, options = {} } = req.body;

    const cleanQuery = sanitizeQuery(query);
    
    if (!cleanQuery || cleanQuery.length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Please provide a valid search query'
      });
    }

    if (cleanQuery.length < 2) {
      return res.status(400).json({
        error: 'Query too short',
        message: 'Search query must be at least 2 characters'
      });
    }

    // Step 1: Search for documents via Veritus API
    const searchResults = await searchDocuments(cleanQuery, {
      limit: options.limit || 5
    });

    if (searchResults.documents.length === 0) {
      return res.json({
        query: cleanQuery,
        results: null,
        message: 'No relevant documents found for this query'
      });
    }

    // Step 2: Generate AI summary using LLM
    const summary = await generateTrendSummary(cleanQuery, searchResults.documents);

    // Step 3: Generate sub-topics
    const subTopics = await generateSubTopics(cleanQuery, searchResults.documents);

    // Step 4: Get publication trend data for charts
    const trendData = await getPublicationTrend(cleanQuery);

    // Step 5: Track search analytics
    await trackSearch({
      query: cleanQuery,
      resultsCount: searchResults.documents.length,
      sessionId: req.headers['x-session-id'] || 'anonymous',
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    // Return comprehensive response
    res.json({
      query: cleanQuery,
      timestamp: new Date().toISOString(),
      results: {
        overview: summary.overview,
        keyTakeaways: summary.keyTakeaways,
        watchList: summary.watchList,
        confidenceScore: summary.confidenceScore,
        trendDirection: summary.trendDirection,
        timeHorizon: summary.timeHorizon,
        sources: summary.sources,
        subTopics: subTopics.subTopics,
        chartData: trendData.trend,
        metadata: {
          totalDocuments: searchResults.totalResults,
          generatedAt: summary.generatedAt,
          model: summary.model
        }
      }
    });
  })
);

/**
 * GET /api/search/quick
 * Quick search - returns just document list without AI processing
 */
router.get(
  '/quick',
  asyncHandler(async (req, res) => {
    const { q, limit = 5 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const results = await searchDocuments(q, { limit: parseInt(limit) });

    res.json({
      query: q,
      documents: results.documents,
      totalResults: results.totalResults
    });
  })
);

/**
 * POST /api/search/regenerate
 * Regenerate summary for existing documents
 */
router.post(
  '/regenerate',
  asyncHandler(async (req, res) => {
    const { query, documents } = req.body;

    if (!query || !documents || !Array.isArray(documents)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Please provide query and documents array'
      });
    }

    const summary = await generateTrendSummary(query, documents);
    const subTopics = await generateSubTopics(query, documents);

    res.json({
      query,
      overview: summary.overview,
      keyTakeaways: summary.keyTakeaways,
      watchList: summary.watchList,
      confidenceScore: summary.confidenceScore,
      trendDirection: summary.trendDirection,
      subTopics: subTopics.subTopics,
      regeneratedAt: new Date().toISOString()
    });
  })
);

/**
 * GET /api/search/suggestions
 * Get autocomplete suggestions based on partial query
 */
router.get(
  '/suggestions',
  asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Predefined suggestions (in production, would use search history + trending)
    const allSuggestions = [
      'AI in healthcare',
      'AI drug discovery',
      'AI diagnostics',
      'artificial intelligence ethics',
      'carbon-neutral startups',
      'carbon capture technology',
      'climate tech investment',
      'Web3 funding decline',
      'Web3 enterprise adoption',
      'blockchain sustainability',
      'renewable energy investment',
      'renewable energy storage',
      'electric vehicle market',
      'EV battery technology',
      'generative AI enterprise',
      'generative AI regulation',
      'fintech regulation',
      'fintech innovation',
      'remote work productivity',
      'hybrid work models',
      'quantum computing applications',
      'cybersecurity trends',
      'edge computing growth',
      'sustainable agriculture tech',
      'space technology commercialization'
    ];

    const query = q.toLowerCase();
    const matches = allSuggestions
      .filter((s) => s.toLowerCase().includes(query))
      .slice(0, 8);

    res.json({ suggestions: matches });
  })
);

export default router;
