import express from 'express';
import {
  trackCardView,
  trackShare,
  getAnalyticsSummary
} from '../services/analyticsService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * POST /api/analytics/card-view
 * Track when a user views a trend card
 */
router.post(
  '/card-view',
  asyncHandler(async (req, res) => {
    const { cardId, query, sessionId } = req.body;

    if (!cardId) {
      return res.status(400).json({ error: 'cardId is required' });
    }

    const event = await trackCardView({
      cardId,
      query,
      sessionId: sessionId || req.headers['x-session-id'] || 'anonymous'
    });

    res.json({ success: true, eventId: event.id });
  })
);

/**
 * POST /api/analytics/share
 * Track when a user shares a trend
 */
router.post(
  '/share',
  asyncHandler(async (req, res) => {
    const { platform, query, sessionId } = req.body;

    if (!platform || !query) {
      return res.status(400).json({ error: 'platform and query are required' });
    }

    const event = await trackShare({
      platform,
      query,
      sessionId: sessionId || req.headers['x-session-id'] || 'anonymous'
    });

    res.json({ success: true, eventId: event.id });
  })
);

/**
 * GET /api/analytics/summary
 * Get analytics summary (for admin dashboard)
 */
router.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const { range = '7d' } = req.query;

    const summary = await getAnalyticsSummary(range);

    res.json(summary);
  })
);

/**
 * GET /api/analytics/goal-progress
 * Track progress towards 69-user goal
 */
router.get(
  '/goal-progress',
  asyncHandler(async (req, res) => {
    const summary = await getAnalyticsSummary('30d');

    const goal = 69;
    const current = summary.summary.uniqueUsers;
    const progress = Math.min((current / goal) * 100, 100);

    res.json({
      goal,
      current,
      progress: Math.round(progress * 10) / 10,
      remaining: Math.max(goal - current, 0),
      message:
        current >= goal
          ? '🎉 Goal achieved!'
          : `${goal - current} more users needed to reach goal`
    });
  })
);

export default router;
