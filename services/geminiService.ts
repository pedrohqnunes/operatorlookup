import { GoogleGenAI } from "@google/genai";
import { OperatorProfile, SourceMetadata } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to classify sources based on URL and Operator data
const classifySource = (url: string, title: string, operatorData: Partial<OperatorProfile>): SourceMetadata => {
  const lowerUrl = url.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const operatorDomain = operatorData.website ? new URL(operatorData.website).hostname.replace('www.', '') : '';

  let type: 'OFICIAL' | 'TERCEIROS' | 'NOTICIA' = 'TERCEIROS';
  let reliability: 'ALTA' | 'MEDIA' | 'BAIXA' = 'MEDIA';

  // Check Official
  if ((operatorDomain && lowerUrl.includes(operatorDomain)) || lowerUrl.includes('linkedin.com/company')) {
    type = 'OFICIAL';
    reliability = 'ALTA';
  } 
  // Check High Trust Third Party
  else if (lowerUrl.includes('gov.br') || lowerUrl.includes('anatel.gov.br') || lowerUrl.includes('reclameaqui.com.br') || lowerUrl.includes('consumidor.gov.br')) {
    type = 'TERCEIROS';
    reliability = 'ALTA';
  }
  // Check News
  else if (
    lowerUrl.includes('g1.globo') || lowerUrl.includes('tecmundo') || lowerUrl.includes('olhardigital') || 
    lowerUrl.includes('infomoney') || lowerUrl.includes('estadao') || lowerUrl.includes('folha') ||
    lowerUrl.includes('minhaoperadora') || lowerUrl.includes('tecnoblog')
  ) {
    type = 'NOTICIA';
    reliability = 'MEDIA';
  }
  // Low Trust / Generic
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

// Manually define the schema string for the prompt since we can't use responseSchema with tools
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

export const fetchOperatorData = async (query: string): Promise<OperatorProfile> => {
  try {
    const model = "gemini-2.5-flash";
    
    // We use the googleSearch tool to act as the "Crawler/API Aggregator".
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

    // Clean potential markdown wrapping which often happens even when asked not to
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse JSON manually
    let data: OperatorProfile;
    try {
      data = JSON.parse(text) as OperatorProfile;
    } catch (e) {
      console.error("Failed to parse JSON from AI response:", text);
      throw new Error("Invalid data format received from analysis.");
    }

    // Post-processing: Extract grounding metadata to build rich source list
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Map chunks to unique SourceMetadata objects
    const processedSources: SourceMetadata[] = [];
    const seenUrls = new Set<string>();

    groundingChunks.forEach(chunk => {
      if (chunk.web?.uri && !seenUrls.has(chunk.web.uri)) {
        seenUrls.add(chunk.web.uri);
        const metadata = classifySource(chunk.web.uri, chunk.web.title || '', data);
        processedSources.push(metadata);
      }
    });

    return {
      ...data,
      sources: processedSources, // Replace simple strings with rich objects
      id: crypto.randomUUID(),
      last_analyzed: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error fetching operator data:", error);
    throw error;
  }
};