/**
 * LLM Service - AI-powered trend analysis
 * Handles integration with OpenAI for generating summaries and insights
 */

import OpenAI from 'openai';

interface Document {
  title: string;
  abstract: string;
  url: string | null;
  source: string;
  publishedDate: string;
}

interface KeyTakeaway {
  text: string;
  citations: number[];
}

interface Source {
  index: number;
  title: string;
  url: string | null;
  source: string;
  publishedDate: string;
}

interface TrendSummary {
  overview: string;
  keyTakeaways: KeyTakeaway[];
  watchList: string[];
  confidenceScore: number;
  trendDirection: 'rising' | 'stable' | 'declining';
  timeHorizon: 'short-term' | 'medium-term' | 'long-term';
  sources: Source[];
  generatedAt: string;
  model: string;
}

interface SubTopic {
  name: string;
  description: string;
  relevantSources: number[];
  trendStrength: 'high' | 'medium' | 'low';
}

interface SubTopicsResult {
  subTopics: SubTopic[];
}

// Initialize OpenAI client only if API key is available
const getOpenAI = (): OpenAI | null => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your_openai_api_key_here') {
    return new OpenAI({ apiKey });
  }
  return null;
};

/**
 * Generate a trend summary using GPT-4 based on retrieved documents
 */
export const generateTrendSummary = async (
  query: string,
  documents: Document[]
): Promise<TrendSummary> => {
  const openai = getOpenAI();

  // If no API key configured or client not initialized, use mock summary
  if (!openai) {
    console.log('⚠ Using mock LLM response (no OpenAI API key configured)');
    return generateMockSummary(query, documents);
  }

  try {
    // Prepare document context for the prompt
    const documentContext = documents
      .map((doc, index) => {
        return `[${index + 1}] "${doc.title}" (${doc.source}, ${doc.publishedDate})
Abstract: ${doc.abstract}`;
      })
      .join('\n\n');

    const prompt = `You are a market research analyst providing insights on current trends.
Based on the following research documents about "${query}", generate a comprehensive trend analysis.

RESEARCH DOCUMENTS:
${documentContext}

Please provide:
1. A concise overview paragraph (3-4 sentences) summarizing the current state of this trend
2. 4-5 key takeaways as bullet points, each citing the relevant source using [n] format
3. A "What to Watch" section with 2-3 future predictions or emerging developments
4. A confidence score (1-10) for how well-established this trend is based on the evidence

Format your response as JSON with this structure:
{
  "overview": "string",
  "keyTakeaways": [
    {"text": "string", "citations": [1, 2]}
  ],
  "watchList": ["string"],
  "confidenceScore": number,
  "trendDirection": "rising" | "stable" | "declining",
  "timeHorizon": "short-term" | "medium-term" | "long-term"
}

Ensure all claims are grounded in the provided sources. Do not make up information not present in the documents.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert market research analyst specializing in trend analysis. Always respond with valid JSON. Be concise, factual, and cite sources using [n] format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content || '{}');

    return {
      ...parsed,
      sources: documents.map((doc, index) => ({
        index: index + 1,
        title: doc.title,
        url: doc.url,
        source: doc.source,
        publishedDate: doc.publishedDate,
      })),
      generatedAt: new Date().toISOString(),
      model: 'gpt-4o',
    };
  } catch (error) {
    console.error('LLM API error:', error);

    // Fallback to mock on error in development
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠ Falling back to mock summary');
      return generateMockSummary(query, documents);
    }

    throw error;
  }
};

/**
 * Generate sub-topic cards for a trend
 */
export const generateSubTopics = async (
  query: string,
  documents: Document[]
): Promise<SubTopicsResult> => {
  const openai = getOpenAI();

  if (!openai) {
    return generateMockSubTopics(query);
  }

  try {
    const documentSummaries = documents
      .map((doc, i) => `[${i + 1}] ${doc.title}: ${doc.abstract.substring(0, 200)}...`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at categorizing and organizing research topics. Respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Given these research documents about "${query}", identify 3-4 distinct sub-topics or perspectives.

Documents:
${documentSummaries}

Return JSON:
{
  "subTopics": [
    {
      "name": "Sub-topic name",
      "description": "One sentence description",
      "relevantSources": [1, 2],
      "trendStrength": "high" | "medium" | "low"
    }
  ]
}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{"subTopics":[]}');
  } catch (error) {
    console.error('Error generating sub-topics:', error);
    return generateMockSubTopics(query);
  }
};

/**
 * Mock summary for development without API key
 */
const generateMockSummary = (query: string, documents: Document[]): TrendSummary => {
  const currentYear = new Date().getFullYear();

  return {
    overview: `${query} is experiencing significant momentum in ${currentYear}, with research publications increasing by approximately 45% year-over-year. Key drivers include technological advancement, increased investment from both public and private sectors, and growing market demand. The evidence suggests this trend is well-established with strong fundamentals supporting continued growth.`,
    keyTakeaways: [
      {
        text: `Research output in ${query} has grown substantially, with leading institutions publishing groundbreaking studies on applications and implementation strategies.`,
        citations: [1, 2],
      },
      {
        text: 'Investment in this sector has reached record levels, with venture capital and corporate R&D budgets allocating significant resources.',
        citations: [1],
      },
      {
        text: 'Regulatory frameworks are evolving to accommodate innovation while ensuring safety and ethical considerations.',
        citations: [3, 4],
      },
      {
        text: 'Cross-industry collaboration is accelerating adoption and driving standardization efforts.',
        citations: [2, 3],
      },
      {
        text: 'Emerging markets are showing increased interest, potentially reshaping the global competitive landscape.',
        citations: [4],
      },
    ],
    watchList: [
      'Integration with AI and automation technologies expected to unlock new use cases',
      'Regulatory clarity in major markets could accelerate mainstream adoption',
      'Sustainability considerations increasingly influencing development priorities',
    ],
    confidenceScore: 8,
    trendDirection: 'rising',
    timeHorizon: 'medium-term',
    sources: documents.map((doc, index) => ({
      index: index + 1,
      title: doc.title,
      url: doc.url,
      source: doc.source,
      publishedDate: doc.publishedDate,
    })),
    generatedAt: new Date().toISOString(),
    model: 'mock',
  };
};

/**
 * Mock sub-topics for development
 */
const generateMockSubTopics = (query: string): SubTopicsResult => {
  return {
    subTopics: [
      {
        name: 'Technology & Innovation',
        description: `Technical advances driving ${query} forward`,
        relevantSources: [1, 2],
        trendStrength: 'high',
      },
      {
        name: 'Market & Investment',
        description: 'Funding trends and commercial developments',
        relevantSources: [2, 3],
        trendStrength: 'high',
      },
      {
        name: 'Regulation & Policy',
        description: 'Evolving regulatory landscape and compliance requirements',
        relevantSources: [3, 4],
        trendStrength: 'medium',
      },
    ],
  };
};

export default { generateTrendSummary, generateSubTopics };

