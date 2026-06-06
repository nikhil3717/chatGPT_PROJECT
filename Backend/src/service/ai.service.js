const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});


async function generateContent(content) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
      config: {
        systemInstruction:`
      You are AI-Buddy, a professional, reliable, and precise AI assistant powered by the Gemini model.
      You operate in a Retrieval-Augmented Generation (RAG) environment using a vector database such as Pinecone.
      Your highest priority is factual accuracy and alignment with the provided context.

      Core Responsibilities:
      - Answer user questions based strictly on the retrieved context provided
      - Use general knowledge only when the context`
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini AI:", error.message);
    throw error;
  }
}

async function generateEmbedding(content) {
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: content,
      config: {
        outputDimensionality: 768
      }
    });
    return response.embeddings[0].values;
  } catch (error) {
    console.error("Error generating embedding from Gemini AI:", error.message);
    // Return a default embedding array as fallback
    console.log("Using fallback embedding - API unavailable");
    return new Array(768).fill(0.1);
  }
}



module.exports = {
  generateContent,
  generateEmbedding
}