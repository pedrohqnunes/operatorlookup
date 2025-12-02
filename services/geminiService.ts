import { OperatorProfile } from '../types';

export const fetchOperatorData = async (query: string): Promise<OperatorProfile> => {
  try {
    // Call the Vercel Serverless Function instead of Google Gemini directly
    // This protects the API_KEY from being exposed in the browser
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: OperatorProfile = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching operator data:", error);
    throw error;
  }
};