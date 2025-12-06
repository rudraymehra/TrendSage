import express from 'express';
import { getTrendingTopics, getPublicationTrend } from '../services/analyticsService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * GET /api/trending
 * Get trending topics based on search frequency
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const topics = await getTrendingTopics(parseInt(limit));

    res.json({
      topics,
      updatedAt: new Date().toISOString()
    });
  })
);

/**
 * GET /api/trending/categories
 * Get trending topics organized by category
 */
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = {
      technology: [
        { query: 'AI in healthcare', searchCount: 156, trend: 'rising' },
        { query: 'generative AI enterprise', searchCount: 112, trend: 'rising' },
        { query: 'quantum computing applications', searchCount: 78, trend: 'stable' },
        { query: 'edge computing growth', searchCount: 65, trend: 'rising' }
      ],
      sustainability: [
        { query: 'carbon-neutral startups', searchCount: 89, trend: 'rising' },
        { query: 'renewable energy investment', searchCount: 98, trend: 'rising' },
        { query: 'sustainable agriculture tech', searchCount: 54, trend: 'stable' },
        { query: 'carbon capture technology', searchCount: 67, trend: 'rising' }
      ],
      finance: [
        { query: 'Web3 funding decline', searchCount: 72, trend: 'declining' },
        { query: 'fintech regulation', searchCount: 54, trend: 'stable' },
        { query: 'DeFi sustainability', searchCount: 43, trend: 'declining' },
        { query: 'digital banking trends', searchCount: 61, trend: 'stable' }
      ],
      business: [
        { query: 'remote work productivity', searchCount: 47, trend: 'stable' },
        { query: 'hybrid work models', searchCount: 52, trend: 'rising' },
        { query: 'supply chain AI', searchCount: 44, trend: 'rising' },
        { query: 'workforce automation', searchCount: 38, trend: 'stable' }
      ]
    };

    res.json({
      categories,
      updatedAt: new Date().toISOString()
    });
  })
);

/**
 * GET /api/trending/chart/:topic
 * Get publication trend chart data for a specific topic
 */
router.get(
  '/chart/:topic',
  asyncHandler(async (req, res) => {
    const { topic } = req.params;

    const trendData = await getPublicationTrend(decodeURIComponent(topic));

    res.json(trendData);
  })
);

/**
 * GET /api/trending/featured
 * Get featured/curated trending topics for homepage
 */
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const featured = [
      {
        query: 'AI in healthcare',
        title: 'AI in Healthcare',
        description: 'Explore how artificial intelligence is transforming medical diagnostics, drug discovery, and patient care.',
        icon: '🏥',
        category: 'Technology',
        trend: 'rising',
        searchCount: 156
      },
      {
        query: 'carbon-neutral startups',
        title: 'Carbon-Neutral Startups',
        description: 'Discover the latest in climate tech ventures focused on achieving net-zero emissions.',
        icon: '🌱',
        category: 'Sustainability',
        trend: 'rising',
        searchCount: 89
      },
      {
        query: 'generative AI enterprise',
        title: 'Generative AI in Enterprise',
        description: 'Learn how businesses are adopting generative AI for productivity and innovation.',
        icon: '🤖',
        category: 'Technology',
        trend: 'rising',
        searchCount: 112
      },
      {
        query: 'Web3 funding decline',
        title: 'Web3 Funding Trends',
        description: 'Analyze the shifting investment landscape in blockchain and decentralized technologies.',
        icon: '🔗',
        category: 'Finance',
        trend: 'declining',
        searchCount: 72
      },
      {
        query: 'renewable energy investment',
        title: 'Renewable Energy Investment',
        description: 'Track capital flows into solar, wind, and other clean energy technologies.',
        icon: '⚡',
        category: 'Sustainability',
        trend: 'rising',
        searchCount: 98
      },
      {
        query: 'quantum computing applications',
        title: 'Quantum Computing Applications',
        description: 'Explore practical use cases emerging from advances in quantum computing.',
        icon: '🔬',
        category: 'Technology',
        trend: 'stable',
        searchCount: 78
      }
    ];

    res.json({
      featured,
      updatedAt: new Date().toISOString()
    });
  })
);

export default router;
