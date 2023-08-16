const fs = require("fs");
const path = require("path");

// Read and process the corpus file (hemingway.txt)
const corpusPath = path.join(__dirname, "corpus/hemingway.txt");
const searchCorpus = fs
  .readFileSync(corpusPath, "utf-8")
  .toLowerCase()
  .split(/\s+/);

// Helper function for similarity calculation (Levenshtein distance)
function levenshteinDistance(s1, s2) {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const cost = s1[0] === s2[0] ? 0 : 1;

  return Math.min(
    levenshteinDistance(s1.slice(1), s2) + 1,
    levenshteinDistance(s1, s2.slice(1)) + 1,
    levenshteinDistance(s1.slice(1), s2.slice(1)) + cost
  );
}

// function searchSimilarWords(query) {
//   const wordDistances = searchCorpus.map((word) => ({
//     word,
//     distance: levenshteinDistance(query, word),
//   }));

//   const sortedWords = wordDistances.sort((a, b) => a.distance - b.distance);
//   const similarWords = sortedWords.slice(0, 3).map((result) => result.word);
//   const count = wordDistances.filter((result) => result.word === query);

//   return { similarWords, count };
// }

// function searchSimilarWords(query) {
//   const sortedQuery = query.toLowerCase().split('').sort().join('');
  
//   const matchingWords = searchCorpus.filter((word) => {
//     const lowercaseWord = word.toLowerCase();
//     const sortedWord = lowercaseWord.split('').sort().join('');
//     return sortedWord.includes(sortedQuery);
//   });

//   const wordDistances = matchingWords.map((word) => ({
//     word,
//     distance: levenshteinDistance(query, word),
//   }));

//   const sortedWords = wordDistances.sort((a, b) => a.distance - b.distance);

//   const similarWords = sortedWords.slice(0, 3).map((result) => result.word);
//   const count = matchingWords.filter((word) => word.toLowerCase() === query.toLowerCase()).length;

//   return { similarWords, count };
// }

function searchSimilarWords(query) {
  const regexPattern = createRegexPattern(query);

  const matchingWords = searchCorpus.filter((word) => regexPattern.test(word.toLowerCase()));

  const wordDistances = matchingWords.map((word) => ({
    word,
    distance: levenshteinDistance(query, word),
  }));

  const sortedWords = wordDistances.sort((a, b) => a.distance - b.distance);

  const similarWords = sortedWords.slice(0, 3).map((result) => result.word);
  const count = matchingWords.filter((word) => word.toLowerCase() === query.toLowerCase()).length;

  return { similarWords, count };
}

function createRegexPattern(query) {
  const escapedQuery = escapeRegExp(query.toLowerCase());
  return new RegExp(`^[${escapedQuery}]+$`);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}




function addWord(newWord) {
  const normalizedNewWord = newWord.toLowerCase();
  if (!searchCorpus.includes(normalizedNewWord)) {
    searchCorpus.push(normalizedNewWord);
  }
}

function removeSimilarWord(wordToRemove) {
  const normalizedWordToRemove = wordToRemove.toLowerCase();
  const mostSimilarWord = searchSimilarWords(normalizedWordToRemove)[0];
  const index = searchCorpus.indexOf(mostSimilarWord);
  if (index !== -1) {
    searchCorpus.splice(index, 1);
  }
}

module.exports = {
  searchSimilarWords,
  addWord,
  removeSimilarWord,
};
