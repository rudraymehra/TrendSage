/**
 * Veritus API Service - Scholarly Search
 * Handles integration with Veritus API for academic paper search
 */

interface VeritusDocument {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string | null;
  source: string;
  publishedDate: string;
  citations: number;
  relevanceScore: number;
  fieldsOfStudy?: string[];
  isOpenAccess?: boolean;
  quartileRanking?: string | null;
}

interface SearchResult {
  documents: VeritusDocument[];
  totalResults: number;
}

interface VeritusApiResponse {
  id?: string;
  title?: string;
  authors?: string | string[];
  abstract?: string;
  tldr?: string;
  link?: string;
  pdfLink?: string;
  titleLink?: string;
  semanticLink?: string;
  doi?: string;
  journalName?: string;
  v_journal_name?: string;
  publicationType?: string;
  publishedAt?: string;
  year?: number;
  impactFactor?: { citationCount?: number };
  citationCount?: number;
  score?: number;
  fieldsOfStudy?: string[];
  isOpenAccess?: boolean;
  v_quartile_ranking?: string;
}

const getConfig = () => ({
  apiUrl: process.env.VERITUS_API_URL || 'https://discover.veritus.ai/api',
  apiKey: process.env.VERITUS_API_KEY,
});

/**
 * Search for scholarly documents using Veritus API
 */
export const searchDocuments = async (
  query: string,
  options: { limit?: number } = {}
): Promise<SearchResult> => {
  const { limit = 5 } = options;
  const { apiUrl, apiKey } = getConfig();

  // If no API key, return mock data for development
  if (!apiKey || apiKey === 'your_veritus_api_key_here') {
    console.log('⚠ Using mock data (no Veritus API key configured)');
    return getMockResults(query);
  }

  try {
    const response = await fetch(
      `${apiUrl}/v1/papers/search?title=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Veritus API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Veritus API response received');
    return normalizeVeritusResponse(data, limit);
  } catch (error) {
    console.error('Veritus API error:', error);

    // Fallback to mock data on error
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠ Falling back to mock data');
      return getMockResults(query);
    }

    throw error;
  }
};

/**
 * Normalize Veritus API response to consistent format
 */
const normalizeVeritusResponse = (
  data: VeritusApiResponse[] | { results?: VeritusApiResponse[]; result?: VeritusApiResponse[] },
  limit: number = 5
): SearchResult => {
  const papers = Array.isArray(data)
    ? data
    : (data.results || data.result || []);

  if (!papers || papers.length === 0) {
    return { documents: [], totalResults: 0 };
  }

  const documents: VeritusDocument[] = papers.slice(0, limit).map((doc, index) => ({
    id: doc.id || `doc-${index}`,
    title: doc.title || 'Untitled',
    authors:
      typeof doc.authors === 'string'
        ? doc.authors.split(',').map((a) => a.trim())
        : doc.authors || [],
    abstract: doc.abstract || doc.tldr || '',
    url:
      doc.link ||
      doc.pdfLink ||
      doc.titleLink ||
      doc.semanticLink ||
      (doc.doi ? `https://doi.org/${doc.doi}` : null),
    source:
      doc.journalName ||
      doc.v_journal_name ||
      doc.publicationType ||
      'Academic Source',
    publishedDate: doc.publishedAt || doc.year?.toString() || '',
    citations: doc.impactFactor?.citationCount || doc.citationCount || 0,
    relevanceScore: doc.score || 0,
    fieldsOfStudy: doc.fieldsOfStudy || [],
    isOpenAccess: doc.isOpenAccess || false,
    quartileRanking: doc.v_quartile_ranking || null,
  }));

  return {
    documents,
    totalResults: papers.length,
  };
};

/**
 * Mock data for development/demo purposes
 */
const getMockResults = (query: string): SearchResult => {
  const queryLower = query.toLowerCase();

  const mockData: Record<string, VeritusDocument[]> = {
    'ai in healthcare': [
      {
        id: 'mock-1',
        title: 'Deep Learning Applications in Medical Imaging: A Comprehensive Review',
        authors: ['Chen, L.', 'Wang, M.', 'Zhang, K.'],
        abstract:
          'This comprehensive review examines the transformative impact of deep learning on medical imaging, including radiology, pathology, and ophthalmology. We analyze over 200 studies demonstrating that AI-assisted diagnosis can improve accuracy by 15-25% while reducing interpretation time by 40%.',
        url: 'https://doi.org/10.1038/s41591-022-01981-2',
        source: 'Nature Medicine',
        publishedDate: '2024',
        citations: 342,
        relevanceScore: 0.95,
      },
      {
        id: 'mock-2',
        title: 'AI-Powered Drug Discovery: From Target Identification to Clinical Trials',
        authors: ['Smith, J.', 'Johnson, R.', 'Davis, A.'],
        abstract:
          'Artificial intelligence is revolutionizing pharmaceutical research, reducing drug development timelines from 10-15 years to potentially 3-5 years. Machine learning models have demonstrated 70% accuracy in predicting drug-target interactions.',
        url: 'https://doi.org/10.1016/j.cell.2024.01.015',
        source: 'Cell',
        publishedDate: '2024',
        citations: 189,
        relevanceScore: 0.92,
      },
      {
        id: 'mock-3',
        title: 'Clinical Implementation of Large Language Models in Hospital Settings',
        authors: ['Williams, E.', 'Brown, S.'],
        abstract:
          'This multi-center study evaluates the deployment of large language models (LLMs) in clinical workflows across 15 major hospital systems. Results show a 35% reduction in documentation time and improved patient communication.',
        url: 'https://doi.org/10.1056/NEJMoa2314501',
        source: 'New England Journal of Medicine',
        publishedDate: '2024',
        citations: 267,
        relevanceScore: 0.89,
      },
      {
        id: 'mock-4',
        title: 'Predictive Analytics for Patient Outcomes: A Machine Learning Approach',
        authors: ['Garcia, M.', 'Lee, H.', 'Patel, N.'],
        abstract:
          'We present a novel machine learning framework for predicting patient outcomes in critical care settings. Using data from 500,000 ICU admissions, our model achieves 89% accuracy in predicting 30-day mortality.',
        url: 'https://doi.org/10.1001/jama.2024.2156',
        source: 'JAMA',
        publishedDate: '2024',
        citations: 156,
        relevanceScore: 0.87,
      },
      {
        id: 'mock-5',
        title: 'Regulatory Frameworks for AI in Healthcare: Global Perspectives',
        authors: ['Thompson, K.', 'Mueller, A.'],
        abstract:
          'As AI adoption in healthcare accelerates, regulatory bodies worldwide are developing frameworks to ensure safety and efficacy. This paper compares approaches from the FDA, EMA, and other agencies.',
        url: 'https://doi.org/10.1016/j.hlpt.2024.100789',
        source: 'Health Policy and Technology',
        publishedDate: '2024',
        citations: 98,
        relevanceScore: 0.84,
      },
    ],
    'carbon-neutral startups': [
      {
        id: 'mock-6',
        title: 'Venture Capital Investment Trends in Climate Tech: 2024 Analysis',
        authors: ['Anderson, P.', 'Martinez, C.'],
        abstract:
          'Climate tech startups raised $42 billion globally in 2023, with carbon capture and green hydrogen leading investment categories.',
        url: 'https://doi.org/10.1038/s41558-024-01924-0',
        source: 'Nature Climate Change',
        publishedDate: '2024',
        citations: 124,
        relevanceScore: 0.93,
      },
      {
        id: 'mock-7',
        title: 'Carbon Credit Markets and Startup Opportunities',
        authors: ['Wilson, R.', 'Taylor, B.'],
        abstract:
          'The voluntary carbon market reached $2 billion in 2023, creating opportunities for innovative startups in verification and trading platforms.',
        url: 'https://doi.org/10.1016/j.jclepro.2024.140521',
        source: 'Journal of Cleaner Production',
        publishedDate: '2024',
        citations: 87,
        relevanceScore: 0.88,
      },
      {
        id: 'mock-8',
        title: 'Direct Air Capture Commercialization: Challenges and Opportunities',
        authors: ['Kumar, S.', 'Chen, Y.', 'Olsen, T.'],
        abstract:
          'Direct air capture (DAC) technology has seen rapid advancement, with costs declining from $600/ton to under $250/ton in leading facilities.',
        url: 'https://doi.org/10.1016/j.joule.2024.02.015',
        source: 'Joule',
        publishedDate: '2024',
        citations: 156,
        relevanceScore: 0.91,
      },
    ],
  };

  // Find best matching mock data or generate generic results
  let results: VeritusDocument[] = [];

  for (const [key, docs] of Object.entries(mockData)) {
    if (queryLower.includes(key.split(' ')[0]) || key.includes(queryLower.split(' ')[0])) {
      results = docs;
      break;
    }
  }

  // If no match, generate generic results
  if (results.length === 0) {
    results = generateGenericResults(query);
  }

  return {
    documents: results,
    totalResults: results.length,
  };
};

/**
 * Generate generic mock results for any query
 */
const generateGenericResults = (query: string): VeritusDocument[] => {
  const currentYear = new Date().getFullYear();

  return [
    {
      id: 'gen-1',
      title: `Recent Advances in ${query}: A Systematic Review`,
      authors: ['Research Team A'],
      abstract: `This systematic review examines the latest developments in ${query}, analyzing trends from 2022-${currentYear}. We synthesize findings from 150+ peer-reviewed publications.`,
      url: 'https://doi.org/10.1000/example1',
      source: 'Academic Research Quarterly',
      publishedDate: currentYear.toString(),
      citations: 45,
      relevanceScore: 0.88,
    },
    {
      id: 'gen-2',
      title: `Market Analysis: ${query} Industry Outlook ${currentYear}`,
      authors: ['Industry Analysts Group'],
      abstract: `Comprehensive market analysis of the ${query} sector, including market size projections, competitive landscape, and investment trends.`,
      url: 'https://doi.org/10.1000/example2',
      source: 'Market Research Institute',
      publishedDate: currentYear.toString(),
      citations: 32,
      relevanceScore: 0.85,
    },
    {
      id: 'gen-3',
      title: `Emerging Technologies Shaping ${query}`,
      authors: ['Tech Innovation Lab'],
      abstract: `An exploration of breakthrough technologies transforming the ${query} landscape. From AI integration to sustainable practices.`,
      url: 'https://doi.org/10.1000/example3',
      source: 'Technology Trends Journal',
      publishedDate: currentYear.toString(),
      citations: 28,
      relevanceScore: 0.82,
    },
    {
      id: 'gen-4',
      title: `${query}: Challenges and Opportunities in the Current Landscape`,
      authors: ['Strategic Research Group'],
      abstract: `A balanced examination of both the obstacles and opportunities facing stakeholders in ${query}.`,
      url: 'https://doi.org/10.1000/example4',
      source: 'Strategic Management Review',
      publishedDate: currentYear.toString(),
      citations: 21,
      relevanceScore: 0.79,
    },
  ];
};

export default { searchDocuments };

