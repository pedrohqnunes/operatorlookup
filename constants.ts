import { ContactType } from './types';

// ============================================================================
// SYSTEM ARCHITECTURE & PROMPTS
// ============================================================================

/**
 * PROMPT A: Identificação e Normalização
 * Used to ensure we are searching for the correct entity.
 */
export const PROMPT_IDENTIFICATION = `
Identify the Brazilian telecom operator or ISP based on the user query.
Correct typos and provide the full commercial name and potential variations (e.g., "Vivo" -> "Vivo / Telefônica Brasil").
If the entity is not a telecom provider, return null.
`;

/**
 * PROMPT B: Classificação de Contatos
 * Rules for classifying phone numbers and emails.
 */
export const PROMPT_CONTACT_CLASSIFICATION = `
Analyze the found contact information.
Rules:
1. 0800 numbers are usually SAC or Ouvidoria.
2. 4004/4003/3003 are usually capitals/metro regions.
3. Classify strictly into types: ${Object.values(ContactType).join(', ')}.
4. Normalize format to +55 (XX) XXXXX-XXXX for mobiles and +55 (XX) XXXX-XXXX for landlines.
5. Do not invent numbers. Only use found data.
`;

/**
 * PROMPT C: Organização de Dados (Master Prompt)
 * This is the main System Instruction used by the Gemini Agent.
 */
export const SYSTEM_INSTRUCTION = `
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

/**
 * PROMPT D: Detecção de Falha Massiva
 * Logic for outage detection.
 */
export const OUTAGE_DETECTION_LOGIC = `
Search queries: "falha massiva [Operator Name] hoje", "[Operator Name] fora do ar twitter", "problemas [Operator Name] agora".
Analysis:
- Is there a high volume of complaints in the last 24h?
- Are there major news articles confirming an outage?
- If yes -> has_active_outage = true.
`;

// Helper for UI
export const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];