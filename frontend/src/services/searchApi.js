// Helper function to handle HTTP response

const BASE_URL = "http://localhost:3001/api";

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
}

// Search similar words API function
export const searchSimilarWords = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${query}`);
    return handleResponse(response);
  } catch (error) {
    throw new Error("Error searching similar words: " + error.message);
  }
};

// Add word API function
export async function addWord(newWord) {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: newWord }),
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error("Error adding word: " + error.message);
  }
}

// Remove similar word API function
export async function removeSimilarWord(wordToRemove) {
  try {
    const response = await fetch(`${BASE_URL}/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: wordToRemove }),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error("Error removing similar word: " + error.message);
  }
}
