import { DiffSegment } from "@/types/proofreads";

/**
 * 단어 기반 diff 생성 (개선된 알고리즘)
 * 참고: Myers 알고리즘과 LCS(Longest Common Subsequence)를 활용
 */
export function generateWordDiff(
  original: string,
  modified: string
): DiffSegment[] {
  // 단어 단위로 분리 (공백과 구두점 유지)
  const originalWords = tokenize(original);
  const modifiedWords = tokenize(modified);

  const lcs = computeLCS(originalWords, modifiedWords);
  return buildDiffFromLCS(originalWords, modifiedWords, lcs);
}

/**
 * 라인 기반 diff 생성
 */
export function generateLineDiff(
  original: string,
  modified: string
): DiffSegment[] {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");

  const lcs = computeLCS(originalLines, modifiedLines);
  return buildDiffFromLCS(originalLines, modifiedLines, lcs);
}

/**
 * 텍스트를 토큰으로 분리 (단어 + 공백 유지)
 */
function tokenize(text: string): string[] {
  // 한글, 영문, 숫자, 공백, 구두점을 구분하여 토큰화
  const tokens: string[] = [];
  const regex = /(\s+|[^\s\w]|\w+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[1]);
  }

  return tokens.filter((token) => token.length > 0);
}

/**
 * LCS(Longest Common Subsequence) 계산
 */
function computeLCS<T>(a: T[], b: T[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * LCS 결과로부터 diff 구성
 */
function buildDiffFromLCS<T>(a: T[], b: T[], lcs: number[][]): DiffSegment[] {
  const result: DiffSegment[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      // 같은 부분
      result.unshift({
        type: "EQUAL",
        text: String(a[i - 1]),
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || lcs[i - 1][j] >= lcs[i][j - 1])) {
      // 삭제된 부분
      result.unshift({
        type: "DELETE",
        text: String(a[i - 1]),
        reason: "개선을 위해 삭제됨",
      });
      i--;
    } else {
      // 추가된 부분
      result.unshift({
        type: "INSERT",
        text: String(b[j - 1]),
        reason: "더 나은 표현으로 추가됨",
      });
      j--;
    }
  }

  return result;
}

/**
 * 문자 기반 세밀한 diff (단어 내부 변경사항)
 */
export function generateCharDiff(
  original: string,
  modified: string
): DiffSegment[] {
  const originalChars = original.split("");
  const modifiedChars = modified.split("");

  const lcs = computeLCS(originalChars, modifiedChars);
  return buildDiffFromLCS(originalChars, modifiedChars, lcs);
}

/**
 * 하이브리드 diff - 단어 단위 우선, 변경된 단어는 문자 단위로 세분화
 */
export function generateHybridDiff(
  original: string,
  modified: string
): DiffSegment[] {
  const wordDiff = generateWordDiff(original, modified);
  const result: DiffSegment[] = [];

  for (const segment of wordDiff) {
    if (segment.type === "EQUAL") {
      result.push(segment);
    } else if (segment.type === "DELETE") {
      // 삭제된 단어들을 찾아서 인접한 INSERT와 비교
      const nextInserts = findNextInserts(wordDiff, wordDiff.indexOf(segment));
      if (nextInserts.length > 0) {
        // 단어 내부 변경사항을 문자 단위로 분석
        const charDiff = generateCharDiff(segment.text, nextInserts[0].text);
        result.push(...charDiff);
      } else {
        result.push(segment);
      }
    } else {
      // INSERT는 이미 위에서 처리되었거나 독립적인 추가
      if (!isPairedWithPreviousDelete(result, segment)) {
        result.push(segment);
      }
    }
  }

  return result;
}

function findNextInserts(
  wordDiff: DiffSegment[],
  startIndex: number
): DiffSegment[] {
  const inserts: DiffSegment[] = [];
  for (let i = startIndex + 1; i < wordDiff.length; i++) {
    if (wordDiff[i].type === "INSERT") {
      inserts.push(wordDiff[i]);
    } else if (wordDiff[i].type === "EQUAL") {
      break;
    }
  }
  return inserts;
}

function isPairedWithPreviousDelete(
  result: DiffSegment[],
  segment: DiffSegment
): boolean {
  // 이전 세그먼트가 DELETE이고 현재가 INSERT인지 확인
  const lastSegment = result[result.length - 1];
  return (
    lastSegment && lastSegment.type === "DELETE" && segment.type === "INSERT"
  );
}

/**
 * Diff 통계 계산
 */
export function calculateDiffStats(diff: DiffSegment[]) {
  const stats = {
    totalSegments: diff.length,
    equalSegments: 0,
    insertSegments: 0,
    deleteSegments: 0,
    totalChars: 0,
    addedChars: 0,
    deletedChars: 0,
    changedWords: 0,
  };

  diff.forEach((segment) => {
    stats.totalChars += segment.text.length;

    switch (segment.type) {
      case "EQUAL":
        stats.equalSegments++;
        break;
      case "INSERT":
        stats.insertSegments++;
        stats.addedChars += segment.text.length;
        stats.changedWords++;
        break;
      case "DELETE":
        stats.deleteSegments++;
        stats.deletedChars += segment.text.length;
        stats.changedWords++;
        break;
    }
  });

  return stats;
}

// 기본 export는 단어 기반 diff
export const generateDiff = generateWordDiff;
