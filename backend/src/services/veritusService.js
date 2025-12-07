import axios from 'axios';

// Helper to get config at runtime (after dotenv has loaded)
const getConfig = () => ({
  apiUrl: process.env.VERITUS_API_URL || 'https://api.veritus.ai/v1',
  apiKey: process.env.VERITUS_API_KEY
});

/**
 * Search for scholarly documents using Veritus API
 * Uses the papers/search endpoint for quick searches
 * Falls back to mock data if API key is not configured
 */
export const searchDocuments = async (query, options = {}) => {
  const { limit = 5 } = options;
  const { apiUrl, apiKey } = getConfig();

  // If no API key, return mock data for development
  if (!apiKey || apiKey === 'your_veritus_api_key_here') {
    console.log('⚠ Using mock data (no Veritus API key configured)');
    return getMockResults(query);
  }

  try {
    // Use the papers/search endpoint (GET request with title parameter)
    // Base URL is https://discover.veritus.ai/api, endpoint is /v1/papers/search
    const response = await axios.get(
      `${apiUrl}/v1/papers/search`,
      {
        params: {
          title: query
        },
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ Veritus API response received');
    return normalizeVeritusResponse(response.data, limit);
  } catch (error) {
    console.error('Veritus API error:', error.response?.data || error.message);

    // Fallback to mock data on error
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠ Falling back to mock data');
      return getMockResults(query);
    }

    throw error;
  }
};

/**
 * Create a search job for bulk results using Veritus Job API
 * Supports keywordSearch, querySearch, or combinedSearch
 */
export const createSearchJob = async (query, options = {}) => {
  const { limit = 100, jobType = 'querySearch' } = options;
  const { apiUrl, apiKey } = getConfig();

  if (!apiKey || apiKey === 'your_veritus_api_key_here') {
    console.log('⚠ Using mock data (no Veritus API key configured)');
    return { jobId: null, useMock: true };
  }

  try {
    // Ensure query meets minimum length requirement (50-5000 chars for querySearch)
    let searchQuery = query;
    if (jobType === 'querySearch' && query.length < 50) {
      // Pad the query to meet minimum requirements
      searchQuery = `Research and analysis on the topic of: ${query}. Looking for recent academic papers, studies, and reports related to this subject area.`;
    }

    const response = await axios.post(
      `${apiUrl}/v1/job/${jobType}`,
      {
        query: searchQuery,
        limit: Math.min(limit, 300), // Max 300 per API docs
        year: `2020:${new Date().getFullYear()}` // Recent papers only
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ Veritus job created:', response.data.jobId);
    return { jobId: response.data.jobId, useMock: false };
  } catch (error) {
    console.error('Veritus Job API error:', error.response?.data || error.message);
    return { jobId: null, useMock: true, error: error.message };
  }
};

/**
 * Check the status of a search job
 */
export const getJobStatus = async (jobId) => {
  const { apiUrl, apiKey } = getConfig();
  
  if (!jobId || !apiKey) {
    return null;
  }

  try {
    const response = await axios.get(
      `${apiUrl}/v1/job/${jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Veritus Job status error:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Get user credits balance
 */
export const getCredits = async () => {
  const { apiUrl, apiKey } = getConfig();
  
  if (!apiKey) {
    return null;
  }

  try {
    const response = await axios.get(
      `${apiUrl}/v1/user/getCredits`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Veritus Credits API error:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Normalize Veritus API response to consistent format
 * Based on Veritus API documentation response fields
 */
const normalizeVeritusResponse = (data, limit = 5) => {
  // Handle array response (from papers/search)
  const papers = Array.isArray(data) ? data : (data.results || data.result || []);
  
  if (!papers || papers.length === 0) {
    return { documents: [], totalResults: 0 };
  }

  const documents = papers.slice(0, limit).map((doc, index) => ({
    id: doc.id || `doc-${index}`,
    title: doc.title || 'Untitled',
    // Veritus returns authors as comma-separated string
    authors: typeof doc.authors === 'string' 
      ? doc.authors.split(',').map(a => a.trim())
      : (doc.authors || []),
    abstract: doc.abstract || doc.tldr || '',
    url: doc.link || doc.titleLink || doc.pdfLink || doc.semanticLink || (doc.doi ? `https://doi.org/${doc.doi}` : null),
    source: doc.journalName || doc.v_journal_name || doc.publicationType || 'Academic Source',
    publishedDate: doc.publishedAt || doc.year?.toString() || '',
    citations: doc.impactFactor?.citationCount || doc.citationCount || 0,
    relevanceScore: doc.score || 0,
    // Additional Veritus fields
    fieldsOfStudy: doc.fieldsOfStudy || [],
    isOpenAccess: doc.isOpenAccess || false,
    quartileRanking: doc.v_quartile_ranking || null
  }));

  return {
    documents,
    totalResults: papers.length
  };
};

/**
 * Mock data for development/demo purposes
 */
const getMockResults = (query) => {
  const queryLower = query.toLowerCase();

  // Generate contextual mock data based on query
  const mockData = {
    'ai in healthcare': [
      {
        id: 'mock-1',
        title: 'Deep Learning Applications in Medical Imaging: A Comprehensive Review',
        authors: ['Chen, L.', 'Wang, M.', 'Zhang, K.'],
        abstract: 'This comprehensive review examines the transformative impact of deep learning on medical imaging, including radiology, pathology, and ophthalmology. We analyze over 200 studies demonstrating that AI-assisted diagnosis can improve accuracy by 15-25% while reducing interpretation time by 40%. Key applications include tumor detection, disease progression monitoring, and automated screening programs.',
        url: 'https://doi.org/10.1038/s41591-022-01981-2',
        source: 'Nature Medicine',
        publishedDate: '2024',
        citations: 342,
        relevanceScore: 0.95
      },
      {
        id: 'mock-2',
        title: 'AI-Powered Drug Discovery: From Target Identification to Clinical Trials',
        authors: ['Smith, J.', 'Johnson, R.', 'Davis, A.'],
        abstract: 'Artificial intelligence is revolutionizing pharmaceutical research, reducing drug development timelines from 10-15 years to potentially 3-5 years. This paper presents case studies of AI-discovered compounds now in Phase II trials, with a focus on rare diseases and cancer therapeutics. Machine learning models have demonstrated 70% accuracy in predicting drug-target interactions.',
        url: 'https://doi.org/10.1016/j.cell.2024.01.015',
        source: 'Cell',
        publishedDate: '2024',
        citations: 189,
        relevanceScore: 0.92
      },
      {
        id: 'mock-3',
        title: 'Clinical Implementation of Large Language Models in Hospital Settings',
        authors: ['Williams, E.', 'Brown, S.'],
        abstract: 'This multi-center study evaluates the deployment of large language models (LLMs) in clinical workflows across 15 major hospital systems. Results show a 35% reduction in documentation time, improved patient communication, and enhanced diagnostic support. We also address critical considerations around patient privacy, model reliability, and integration with existing EHR systems.',
        url: 'https://doi.org/10.1056/NEJMoa2314501',
        source: 'New England Journal of Medicine',
        publishedDate: '2024',
        citations: 267,
        relevanceScore: 0.89
      },
      {
        id: 'mock-4',
        title: 'Predictive Analytics for Patient Outcomes: A Machine Learning Approach',
        authors: ['Garcia, M.', 'Lee, H.', 'Patel, N.'],
        abstract: 'We present a novel machine learning framework for predicting patient outcomes in critical care settings. Using data from 500,000 ICU admissions, our model achieves 89% accuracy in predicting 30-day mortality and 85% accuracy in readmission risk. This enables proactive interventions and resource optimization.',
        url: 'https://doi.org/10.1001/jama.2024.2156',
        source: 'JAMA',
        publishedDate: '2024',
        citations: 156,
        relevanceScore: 0.87
      },
      {
        id: 'mock-5',
        title: 'Regulatory Frameworks for AI in Healthcare: Global Perspectives',
        authors: ['Thompson, K.', 'Mueller, A.'],
        abstract: 'As AI adoption in healthcare accelerates, regulatory bodies worldwide are developing frameworks to ensure safety and efficacy. This paper compares approaches from the FDA, EMA, and other agencies, analyzing 47 AI/ML-based medical devices approved in 2023-2024. We propose harmonization strategies for global health AI governance.',
        url: 'https://doi.org/10.1016/j.hlpt.2024.100789',
        source: 'Health Policy and Technology',
        publishedDate: '2024',
        citations: 98,
        relevanceScore: 0.84
      }
    ],
    'carbon-neutral startups': [
      {
        id: 'mock-6',
        title: 'Venture Capital Investment Trends in Climate Tech: 2024 Analysis',
        authors: ['Anderson, P.', 'Martinez, C.'],
        abstract: 'Climate tech startups raised $42 billion globally in 2023, with carbon capture and green hydrogen leading investment categories. This report analyzes 850 funding rounds, identifying key success factors and emerging sub-sectors. Notable trends include increased corporate venture participation and geographic diversification beyond traditional hubs.',
        url: 'https://doi.org/10.1038/s41558-024-01924-0',
        source: 'Nature Climate Change',
        publishedDate: '2024',
        citations: 124,
        relevanceScore: 0.93
      },
      {
        id: 'mock-7',
        title: 'Carbon Credit Markets and Startup Opportunities',
        authors: ['Wilson, R.', 'Taylor, B.'],
        abstract: 'The voluntary carbon market reached $2 billion in 2023, creating opportunities for innovative startups in verification, trading platforms, and project development. We analyze the competitive landscape and identify gaps in the market being addressed by emerging companies, with case studies of successful market entrants.',
        url: 'https://doi.org/10.1016/j.jclepro.2024.140521',
        source: 'Journal of Cleaner Production',
        publishedDate: '2024',
        citations: 87,
        relevanceScore: 0.88
      },
      {
        id: 'mock-8',
        title: 'Direct Air Capture Commercialization: Challenges and Opportunities',
        authors: ['Kumar, S.', 'Chen, Y.', 'Olsen, T.'],
        abstract: 'Direct air capture (DAC) technology has seen rapid advancement, with costs declining from $600/ton to under $250/ton in leading facilities. This paper examines the technical and economic factors driving commercialization, profiles key startups in the space, and projects market growth to 2030.',
        url: 'https://doi.org/10.1016/j.joule.2024.02.015',
        source: 'Joule',
        publishedDate: '2024',
        citations: 156,
        relevanceScore: 0.91
      }
    ],
    'web3 funding': [
      {
        id: 'mock-9',
        title: 'Web3 Investment Landscape: Post-Crypto Winter Analysis',
        authors: ['Roberts, J.', 'Kim, S.'],
        abstract: 'Following the 2022-2023 crypto downturn, Web3 investment has evolved significantly. This analysis of 1,200 funding rounds reveals a shift from speculative tokens to infrastructure and enterprise applications. Average round sizes have decreased 45% but deal quality metrics have improved substantially.',
        url: 'https://doi.org/10.2139/ssrn.4567890',
        source: 'SSRN',
        publishedDate: '2024',
        citations: 67,
        relevanceScore: 0.90
      },
      {
        id: 'mock-10',
        title: 'DeFi Protocol Sustainability: Revenue Models and Token Economics',
        authors: ['Nakamoto, A.', 'Vitalik, N.'],
        abstract: 'This study examines 50 leading DeFi protocols to identify sustainable business models. We find that protocols focusing on real yield rather than token emissions demonstrate 3x better user retention and more stable TVL. Key success factors include diversified revenue streams and institutional partnerships.',
        url: 'https://doi.org/10.1016/j.frl.2024.105234',
        source: 'Finance Research Letters',
        publishedDate: '2024',
        citations: 89,
        relevanceScore: 0.85
      }
    ]
  };

  // Find best matching mock data or generate generic results
  let results = [];

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
    totalResults: results.length
  };
};

/**
 * Generate generic mock results for any query
 */
const generateGenericResults = (query) => {
  const currentYear = new Date().getFullYear();

  return [
    {
      id: 'gen-1',
      title: `Recent Advances in ${query}: A Systematic Review`,
      authors: ['Research Team A'],
      abstract: `This systematic review examines the latest developments in ${query}, analyzing trends from 2022-${currentYear}. We synthesize findings from 150+ peer-reviewed publications to identify key themes, challenges, and future directions in this rapidly evolving field.`,
      url: 'https://doi.org/10.1000/example1',
      source: 'Academic Research Quarterly',
      publishedDate: currentYear.toString(),
      citations: 45,
      relevanceScore: 0.88
    },
    {
      id: 'gen-2',
      title: `Market Analysis: ${query} Industry Outlook ${currentYear}`,
      authors: ['Industry Analysts Group'],
      abstract: `Comprehensive market analysis of the ${query} sector, including market size projections, competitive landscape, and investment trends. The global market is projected to grow at 15% CAGR through 2028, driven by technological innovation and increasing demand.`,
      url: 'https://doi.org/10.1000/example2',
      source: 'Market Research Institute',
      publishedDate: currentYear.toString(),
      citations: 32,
      relevanceScore: 0.85
    },
    {
      id: 'gen-3',
      title: `Emerging Technologies Shaping ${query}`,
      authors: ['Tech Innovation Lab'],
      abstract: `An exploration of breakthrough technologies transforming the ${query} landscape. From AI integration to sustainable practices, we identify the top 10 innovations gaining traction and their potential impact on market dynamics.`,
      url: 'https://doi.org/10.1000/example3',
      source: 'Technology Trends Journal',
      publishedDate: currentYear.toString(),
      citations: 28,
      relevanceScore: 0.82
    },
    {
      id: 'gen-4',
      title: `${query}: Challenges and Opportunities in the Current Landscape`,
      authors: ['Strategic Research Group'],
      abstract: `A balanced examination of both the obstacles and opportunities facing stakeholders in ${query}. Based on interviews with 50+ industry leaders and analysis of recent developments, we provide actionable insights for navigating this complex environment.`,
      url: 'https://doi.org/10.1000/example4',
      source: 'Strategic Management Review',
      publishedDate: currentYear.toString(),
      citations: 21,
      relevanceScore: 0.79
    }
  ];
};

export default { searchDocuments, createSearchJob, getJobStatus, getCredits };
