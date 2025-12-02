import { GoogleGenAI } from "@google/genai";

// Re-import prompts needed for the server-side logic
const SYSTEM_INSTRUCTION = `
You are the "Operator Lookup Engine 3.0", a specialized system for analyzing Brazilian Telecom Operators and ISPs.
Your goal is to aggregate public data to create a detailed profile of a requested operator.

**Strict Guidelines:**
1.  **Truthfulness:** NEVER invent phone numbers or emails.
2.  **Scope:** Focus on Brazilian operators (Vivo, Claro, Tim, Oi, Brisanet, Algar, Unifique, Desktop, etc.).
3.  **Data Sources:** You will be provided with Google Search Grounding results. Extract facts ONLY from these results.

4.  **Reputation (SOURCE CASCADE STRATEGY):** 
    - **PRIORITY 1 (Official):** Look for "Reclame Aqui" score (0-10). Use the exact number found (e.g., 8.5).
    - **PRIORITY 2 (Social):** Look for "Google Maps/Business" star rating (1-5 stars). Convert to 0-10 scale (multiply by 2).
    - **PRIORITY 3 (Fallback):** If NO numerical data is found, analyze the text of search results (news, social media complaints, headlines) and ESTIMATE a "Sentiment Score" (0-10) based on the tone.
    - **Labeling:** 
       - If inferred/estimated, set source to "Internal AI Analysis".
       - If Reclame Aqui, set source to "Reclame Aqui".
       - If Google, set source to "Google Places".

5.  **Coverage:** Identify which Brazilian states (UF) the operator serves.
6.  **Outages:** Look for VERY RECENT news (last 24-48h) regarding massive failures. If none, status is normal.

**Output Format:**
You must return a JSON object adhering to the specified schema.
`;

const schemaDescription = `
{
  "id": "string",
  "name": "string",
  "legal_name": "string",
  "cnpj": "string",
  "website": "string",
  "description": "string",
  "contacts": [
    {
      "type": "SAC" | "OUVIDORIA" | "VENDAS" | "SUPORTE_TECNICO" | "WHATSAPP" | "EMAIL" | "OUTRO",
      "value": "string",
      "description": "string (optional)",
      "available_hours": "string (optional)"
    }
  ],
  "reputation": [
    {
      "score": number,
      "source": "Reclame Aqui" | "Google Places" | "Consumidor.gov" | "Internal AI Analysis",
      "status": "Ruim" | "Regular" | "Bom" | "Ótimo",
      "total_reviews": number (optional),
      "last_updated": "string"
    }
  ],
  "coverage": ["string (UF codes)"],
  "outage_status": {
    "has_active_outage": boolean,
    "description": "string (optional)",
    "affected_regions": ["string"],
    "last_checked": "string"
  },
  "incident_history": {
    "events": [
      {
        "date": "string (ISO date)",
        "summary": "string",
        "duration": "string",
        "severity": "BAIXA" | "MEDIA" | "ALTA"
      }
    ],
    "stability_trend": "ESTAVEL" | "DEGRADANDO" | "MELHORANDO"
  },
  "data_reliability": {
    "score": number (0-100),
    "rating": "BAIXA" | "MEDIA" | "ALTA",
    "explanation": "string",
    "criteria": {
      "source_count": boolean,
      "cross_validation": boolean,
      "recent_update": boolean
    }
  },
  "operational_risk": {
    "score": number (0-100),
    "level": "BAIXO" | "MODERADO" | "ALTO",
    "factors": ["string"]
  },
  "sources": ["string"],
  "last_analyzed": "string"
}
`;

// Helper to classify sources (duplicated from frontend service for server-side usage)
const classifySource = (url: string, title: string, operatorData: any) => {
  const lowerUrl = url.toLowerCase();
  const operatorDomain = operatorData.website ? new URL(operatorData.website).hostname.replace('www.', '') : '';

  let type = 'TERCEIROS';
  let reliability = 'MEDIA';

  if ((operatorDomain && lowerUrl.includes(operatorDomain)) || lowerUrl.includes('linkedin.com/company')) {
    type = 'OFICIAL';
    reliability = 'ALTA';
  } 
  else if (lowerUrl.includes('gov.br') || lowerUrl.includes('anatel.gov.br') || lowerUrl.includes('reclameaqui.com.br') || lowerUrl.includes('consumidor.gov.br')) {
    type = 'TERCEIROS';
    reliability = 'ALTA';
  }
  else if (
    lowerUrl.includes('g1.globo') || lowerUrl.includes('tecmundo') || lowerUrl.includes('olhardigital') || 
    lowerUrl.includes('infomoney') || lowerUrl.includes('estadao') || lowerUrl.includes('folha') ||
    lowerUrl.includes('minhaoperadora') || lowerUrl.includes('tecnoblog')
  ) {
    type = 'NOTICIA';
    reliability = 'MEDIA';
  }
  else {
    reliability = 'BAIXA';
  }

  return {
    url,
    title: title || new URL(url).hostname,
    type,
    reliability,
    timestamp: new Date().toISOString()
  };
};

export default async function handler(req: any, res: any) {
  // Vercel Serverless Function
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [{ text: `Search for detailed information about the Brazilian telecom operator: "${query}". 
          
          I need you to perform a deep search to find:
          1. Official support phone numbers (SAC, WhatsApp, Ouvidoria).
          2. Official website and CNPJ.
          3. **REPUTATION (MANDATORY)**: 
             - Search for "${query} Reclame Aqui nota" (look for numbers like 8.5/10).
             - Search for "${query} Google Maps reviews" (look for stars 4.5/5).
             - Search for "${query} problemas reclame aqui" to analyze sentiment.
          4. States where they operate (Cobertura).
          5. Any news in the last 30 days about outages or massive failures.
          
          **ANALYTICS GENERATION & INFERENCE**:
          Based on the found data, you must calculate/infer the following:
          
          A) **Reputation Logic**:
             - If Reclame Aqui score found -> Use it.
             - If Google Stars found -> Convert to 0-10 scale (e.g. 4.5 stars = 9.0).
             - IF NO NUMBERS FOUND -> Analyze the sentiment of the search snippets (complaints vs praise) and ESTIMATE a score (0-10). Mark source as "Internal AI Analysis".
          
          B) **Incident History**: List up to 3 recent outage events found in news/twitter in the last 30 days. If none found, return empty list and trend ESTAVEL.
          
          C) **Data Reliability (0-100%)**:
             - High (80-100%): Multiple official sources found, consistent phone numbers, recent Reclame Aqui data.
             - Medium (50-79%): Some inconsistencies or limited sources.
             - Low (<50%): Only generic info found, no specific contacts.
          
          D) **Operational Risk (0-100%)**:
             - Calculate based on: Recent outages? Low Reputation score? High complaints volume?
             - Low Risk (<30%): Good reputation (>7.0), no recent outages.
             - Moderate Risk (30-69%): Average reputation, minor complaints.
             - High Risk (>70%): Bad reputation (<5.0), active or recent massive outages.
          
          Compile this into a VALID JSON object matching the following schema structure exactly. Do not add Markdown formatting.
          
          Schema Structure:
          ${schemaDescription}
          ` }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.1, 
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return res.status(500).json({ error: "Invalid data format from AI" });
    }

    // Process sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const processedSources: any[] = [];
    const seenUrls = new Set<string>();

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri && !seenUrls.has(chunk.web.uri)) {
        seenUrls.add(chunk.web.uri);
        const metadata = classifySource(chunk.web.uri, chunk.web.title || '', data);
        processedSources.push(metadata);
      }
    });

    const finalData = {
      ...data,
      sources: processedSources,
      id: crypto.randomUUID(),
      last_analyzed: new Date().toISOString()
    };

    return res.status(200).json(finalData);

  } catch (error: any) {
    console.error("Server API Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}