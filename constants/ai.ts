import { ConceptCategory } from "@/types/ai";

// 업데이트된 컨셉 카테고리와 세부 장르
export const CONCEPT_CATEGORIES: ConceptCategory[] = [
  {
    label: "공부 (수능, 내신)",
    value: "ACADEMIC",
    description: "학업과 시험 준비를 위한 문학 작품",
    genres: [
      {
        label: "현대 문학",
        value: "MODERN_LITERATURE",
        description: "현대 작가들의 소설, 시, 수필",
        targetAudience: "10-20대",
      },
      {
        label: "고전 문학",
        value: "CLASSICAL_LITERATURE",
        description: "전통적인 고전 작품과 시가",
        targetAudience: "10-20대",
      },
    ],
  },
  {
    label: "지적 허영/과시",
    value: "INTELLECTUAL_DISPLAY",
    description: "지적인 인상을 주고 싶을 때",
    genres: [
      {
        label: "논평",
        value: "COMMENTARY",
        description: "사회 현상에 대한 분석과 의견",
        targetAudience: "20-30대",
      },
      {
        label: "칼럼",
        value: "COLUMN",
        description: "전문적인 관점의 글쓰기",
        targetAudience: "20-30대",
      },
      {
        label: "기고문",
        value: "CONTRIBUTION",
        description: "신문이나 잡지에 기고하는 형식",
        targetAudience: "20-30대",
      },
      {
        label: "서평",
        value: "BOOK_REVIEW",
        description: "책에 대한 비평과 감상",
        targetAudience: "20-30대",
      },
    ],
  },
  {
    label: "내 얘기를 재밌게 (SNS용)",
    value: "PERSONAL_STORY",
    description: "개인적인 경험을 매력적으로 표현",
    genres: [
      {
        label: "힙스터 감성 피드",
        value: "HIPSTER_FEED",
        description: "트렌디하고 세련된 일상 표현",
        targetAudience: "20-30대",
      },
      {
        label: "진심 담은 새벽 라디오",
        value: "MIDNIGHT_RADIO",
        description: "감성적이고 솔직한 내면 고백",
        targetAudience: "20-30대",
      },
      {
        label: "에세이",
        value: "ESSAY",
        description: "개인적 경험과 생각을 담은 수필",
        targetAudience: "20-30대",
      },
    ],
  },
];

// 기존 호환성을 위한 전체 컨셉 옵션
export const CONCEPT_OPTIONS = [
  { label: "전체", value: "ALL" },
  ...CONCEPT_CATEGORIES.map((category) => ({
    label: category.label,
    value: category.value,
  })),
];

// 장르별 점수 기준
export const SCORING_CRITERIA = {
  ACADEMIC: {
    primary: ["정확성", "논리성", "구성력"],
    secondary: ["창의성", "감정표현"],
  },
  INTELLECTUAL_DISPLAY: {
    primary: ["논리성", "전문성", "설득력"],
    secondary: ["창의성", "감정표현"],
  },
  PERSONAL_STORY: {
    primary: ["창의성", "감정표현", "재미"],
    secondary: ["정확성", "논리성"],
  },
} as const;
