import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service for StudyOS
 * This service handles communication with Google Gemini for generating study content.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export const generateStudyContent = async (type, topic, count = 4) => {
  console.log(`Generating ${type} for ${topic} (count: ${count}) using Gemini 2.5 Flash Lite...`);

  let prompt = '';

  if (type === 'summary') {
    prompt = `As an expert tutor, generate a structured summary of the topic: "${topic}". 
    Use markdown formatting. Include key concepts, brief explanations, and why it matters. 
    Format like: 
    ### Key Concepts:
    - **Term**: Explanation
    
    ### Why it Matters:
    Short paragraph.`;
  } else if (type === 'questions') {
    prompt = `Generate a practice quiz for the topic: "${topic}". 
    Include 3-4 multiple choice questions and one open-ended question. 
    Use markdown. Format like:
    1. **Question?**
       - A) Option
       - B) Option
    ...`;
  } else if (type === 'flashcards') {
    prompt = `Generate exactly ${count} active recall flashcards for the topic: "${topic}". 
    Return ONLY a JSON array of objects with "front" and "back" keys. 
    Example: [{"front": "Q", "back": "A"}]
    Generate ${count} high-quality, diverse flashcards.`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (type === 'flashcards') {
      try {
        // Clean text if it contains markdown code blocks
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const flashcards = JSON.parse(cleanedText);
        return {
          title: `Flashcards: ${topic}`,
          content: flashcards
        };
      } catch (e) {
        console.error("Failed to parse flashcards JSON", e, text);
        return { title: 'Unknown', content: 'AI returned invalid format for flashcards.' };
      }
    }

    return {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${topic}`,
      content: text
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

