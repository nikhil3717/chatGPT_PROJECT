const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.YOUR_API_KEY });

// Create a dense index with integrated embedding
const cohortChatGptIndex = pc.Index("cohort-chat-gpt");



async function createMemory({ vectors, metadata, messageId }) {
  try {
    await cohortChatGptIndex.upsert([{
      id: messageId,
      values: vectors,
      metadata
    }]);
  } catch (error) {
    console.error("Error creating memory in Pinecone:", error.message);
    // Don't throw - continue even if Pinecone is unavailable
  }
}



async function queryMemory({ queryVector, limit = 5, metadata }) {
  try {
    const data = await cohortChatGptIndex.query({
      vector: queryVector,
      topK: limit,
      filter: metadata ? metadata : undefined,
      includeMetadata: true
    });
    return data.matches;
  } catch (error) {
    console.error("Error querying memory from Pinecone:", error.message);
    // Return empty array as fallback if Pinecone is unavailable
    return [];
  }
}


module.exports = {
  createMemory,
  queryMemory
}




