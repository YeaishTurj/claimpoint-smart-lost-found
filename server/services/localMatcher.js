import { pipeline } from "@huggingface/transformers";

class MatcherPipeline {
  static task = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log("--- Initializing AI Model (all-MiniLM-L6-v2) ---");
      this.instance = await pipeline(this.task, this.model);
    }
    return this.instance;
  }
}

/**
 * Manual Cosine Similarity Calculation
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(mA) * Math.sqrt(mB);
  if (magnitude === 0) return 0;
  return dotProduct / magnitude;
}

export const getLocalMatchScore = async (userProof, hiddenDetails) => {
  try {
    const extractor = await MatcherPipeline.getInstance();

    // This helper extracts ONLY the values from an object and merges them into a sentence
    const flattenAnyInput = (input) => {
      if (!input) return "";
      if (typeof input === "string") return input;
      if (typeof input === "object") {
        // Get all values (e.g., 'sdfsdf'), filter out empty ones, and join
        return Object.values(input)
          .map((val) => (typeof val === "object" ? flattenAnyInput(val) : val))
          .join(" ");
      }
      return String(input);
    };

    const cleanText = (text) => {
      const raw = flattenAnyInput(text);

      // Remove common filler words but preserve key identifiers
      const stopWords = [
        "i have a",
        "it is a",
        "the",
        "is",
        "on",
        "at",
        "from my",
        "there is a",
        "a",
        "an",
        "my",
        "i",
        "and",
        "or",
        "that",
        "with",
        "in",
        "to",
        "for",
      ];

      let cleaned = raw
        .toLowerCase()
        .replace(new RegExp(`\\b(${stopWords.join("|")})\\b`, "g"), "")
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .replace(/\s+/g, " ")
        .trim();

      // Boost weight for specific keywords (IMEI, serial, model numbers, colors)
      const keywordBoosts = [
        "imei",
        "serial",
        "model",
        "black",
        "white",
        "red",
        "blue",
        "gold",
        "silver",
        "space gray",
        "pro",
        "max",
        "plus",
      ];
      const foundKeywords = keywordBoosts.filter((kw) => cleaned.includes(kw));

      // If important keywords match, duplicate them to increase similarity score
      if (foundKeywords.length > 0) {
        cleaned += " " + foundKeywords.join(" ");
      }

      return cleaned;
    };

    const processedTruth = cleanText(hiddenDetails);
    const processedProof = cleanText(userProof);

    console.log("\n--- AI Matching Start ---");
    console.log("Comparing Cleaned Truth:", processedTruth);
    console.log("Comparing Cleaned Proof:", processedProof);

    if (!processedProof) {
      console.log("⚠️ Result: 0% (Proof was empty after cleaning)");
      return { percentage: 0 };
    }

    const output1 = await extractor(processedTruth, {
      pooling: "mean",
      normalize: true,
    });
    const output2 = await extractor(processedProof, {
      pooling: "mean",
      normalize: true,
    });

    const similarity = cosineSimilarity(
      Array.from(output1.data),
      Array.from(output2.data)
    );
    const percentage = Math.max(0, Math.min(100, Math.round(similarity * 100)));

    console.log("Final Percentage:", percentage + "%");
    console.log("--- AI Matching End ---\n");

    return { percentage };
  } catch (error) {
    console.error("Local Matcher Error:", error);
    return { percentage: 0 };
  }
};
