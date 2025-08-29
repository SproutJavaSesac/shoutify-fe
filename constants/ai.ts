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
        targetAudience: "수능, 내신 대비 학습자",
      },
      {
        label: "고전 문학",
        value: "CLASSICAL_LITERATURE",
        description: "전통적인 고전 작품과 시가",
        targetAudience: "문학 기초 공부가 필요한 학습자",
      },
    ],
  },
  {
    label: "전문가 스타일",
    value: "INTELLECTUAL_DISPLAY",
    description: "전문성 있는 글쓰기를 원할 때",
    genres: [
      {
        label: "논평",
        value: "COMMENTARY",
        description: "사회 현상에 대한 분석과 의견",
        targetAudience: "논리적 글쓰기를 연습하고 싶은 분",
      },
      {
        label: "칼럼",
        value: "COLUMN",
        description: "전문적인 관점의 글쓰기",
        targetAudience: "전문성을 어필하고 싶은 분",
      },
      {
        label: "기고문",
        value: "CONTRIBUTION",
        description: "신문이나 잡지에 기고하는 형식",
        targetAudience: "기고 경험이나 연습이 필요한 분",
      },
      {
        label: "서평",
        value: "BOOK_REVIEW",
        description: "책에 대한 비평과 감상",
        targetAudience: "독서 후 생각을 정리하고 싶은 분",
      },
    ],
  },
  {
    label: "일상 스토리",
    value: "PERSONAL_STORY",
    description: "개인적인 경험을 매력적으로 표현",
    genres: [
      {
        label: "힙스터 감성 피드",
        value: "HIPSTER_FEED",
        description: "트렌디하고 세련된 일상 표현",
        targetAudience: "SNS 게시글을 감각적으로 쓰고 싶은 분",
      },
      {
        label: "진심 담은 새벽 라디오",
        value: "MIDNIGHT_RADIO",
        description: "감성적이고 솔직한 내면 고백",
        targetAudience: "진솔한 감정을 아름답게 표현하고 싶은 분",
      },
      {
        label: "에세이",
        value: "ESSAY",
        description: "개인적 경험과 생각을 담은 수필",
        targetAudience: "일상 경험을 의미 있게 기록하고 싶은 분",
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
