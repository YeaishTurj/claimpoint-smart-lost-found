import { db } from "../src/index.js";
import { eq, and } from "drizzle-orm";
import { lostReportsTable, itemMatchesTable } from "../src/models/index.js";
import { getLocalMatchScore } from "./localMatcher.js";

// Simple text normalization
const normalizeText = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Enhanced Jaccard similarity with word position weighting for locations
const locationSimilarity = (a, b) => {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return 0;

  const tokensA = na.split(" ");
  const tokensB = nb.split(" ").slice(0, 5); // Limit B tokens to avoid bias

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  // Exact token matches
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  let jaccardScore =
    union.size === 0 ? 0 : (intersection.size / union.size) * 100;

  // Boost score if first token matches (area/district is often first)
  if (tokensA.length > 0 && tokensB.length > 0 && tokensA[0] === tokensB[0]) {
    jaccardScore = Math.min(100, jaccardScore + 15);
  }

  return Math.round(jaccardScore);
};

export const runAutoMatch = async (newFoundItem) => {
  const matched = [];
  try {
    // 1. Get all OPEN lost reports of the same item_type
    const potentialReports = await db
      .select()
      .from(lostReportsTable)
      .where(
        and(
          eq(lostReportsTable.status, "OPEN"),
          eq(lostReportsTable.item_type, newFoundItem.item_type)
        )
      );

    for (const report of potentialReports) {
      // 2. Details similarity (compare report details with PUBLIC details)
      const detailsResult = await getLocalMatchScore(
        report.report_details,
        newFoundItem.public_details
      );

      // 3. Location similarity (location_lost vs location_found)
      const locScore = locationSimilarity(
        report.location_lost,
        newFoundItem.location_found
      );

      // 4. Date proximity scoring (within 14 days = better match)
      const reportDate = new Date(report.date_lost);
      const foundDate = new Date(newFoundItem.date_found);
      const daysDiff = Math.abs(
        (foundDate - reportDate) / (1000 * 60 * 60 * 24)
      );

      let dateScore = 100;
      if (daysDiff > 14) {
        dateScore = Math.max(30, 100 - daysDiff * 2); // Penalize older matches
      }

      // 5. Weighted scoring (Details: 60%, Location: 30%, Date: 10%)
      const combinedScore = Math.round(
        detailsResult.percentage * 0.6 + locScore * 0.3 + dateScore * 0.1
      );

      // 6. Only save matches above 10% threshold (better precision)
      if (combinedScore >= 10) {
        const [inserted] = await db
          .insert(itemMatchesTable)
          .values({
            lost_report_id: report.id,
            found_item_id: newFoundItem.id,
            match_score: combinedScore,
            status: "PENDING",
          })
          .returning();

        matched.push({
          match_id: inserted.id,
          report_id: report.id,
          found_item_id: newFoundItem.id,
          match_score: combinedScore,
          details_score: detailsResult.percentage,
          location_score: locScore,
          date_score: Math.round(dateScore),
          days_diff: Math.round(daysDiff),
        });

        console.log(
          `🎯 Match stored: Report ${report.id} <-> Item ${
            newFoundItem.id
          } (${combinedScore}%) [details=${
            detailsResult.percentage
          }%, location=${locScore}%, date=${Math.round(
            dateScore
          )}% (${Math.round(daysDiff)}d)]`
        );
      }
    }
  } catch (error) {
    console.error("Auto-match service error:", error);
  }

  return matched;
};
