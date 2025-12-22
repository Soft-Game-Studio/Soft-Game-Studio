import index from '../data/knowledge/index.json';

// Normalize text: lowercase, remove punctuation, trim
const normalize = (text) => {
    return text.toLowerCase().replace(/[^\w\s]/g, '').trim();
};

// Calculate Levenshtein distance for fuzzy matching
const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1,   // insertion
                        matrix[i - 1][j] + 1    // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

// Calculate similarity score (0 to 1)
const getSimilarity = (s1, s2) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - levenshteinDistance(longer, shorter)) / longerLength;
};

export const findMatch = (userInput) => {
    if (!userInput) return null;

    const normalizedInput = normalize(userInput);
    const words = normalizedInput.split(/\s+/);

    let bestMatch = null;
    let highestScore = 0;

    for (const entry of index) {
        let score = 0;

        // 1. Keyword Matching
        const keywordMatches = entry.keywords.filter(k => normalizedInput.includes(k));
        if (keywordMatches.length > 0) {
            score += keywordMatches.length * 0.3; // Base score for keywords

            // Bonus if keyword is the whole input or significant part
            if (keywordMatches.some(k => k === normalizedInput)) {
                score += 0.5;
            }
        }

        // 2. Question Similarity (Fuzzy Match)
        const questionSimilarity = getSimilarity(normalizedInput, normalize(entry.question));
        score += questionSimilarity * 0.5; // Weighted similarity

        // 3. Intent Exact Match (if user typed intent explicitly? Unlikely but good for debugging)
        if (normalizedInput === entry.intent) {
            score += 1.0;
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    }

    // Threshold for a "good" match
    if (highestScore > 0.45) { // Adjusted threshold
        return bestMatch;
    }

    return null;
};
