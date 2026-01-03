
export enum Subject {
  LANDING = 'landing',
  MATH = 'math',
  CHINESE = 'chinese',
  ENGLISH = 'english'
}

export enum DigitMode {
  TWO_TWO = '2x2',
  TWO_THREE = '2x3',
  THREE_THREE = '3x3'
}

export enum OperationType {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
  MIXED = 'mixed'
}

export enum ProblemFormat {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

export interface MathProblem {
  id: number;
  num1: number;
  num2: number;
  operation: '+' | '-';
  answer: number;
}

export interface GeneratorConfig {
  count: number;
  digitMode: DigitMode;
  operation: OperationType;
  format: ProblemFormat;
}

// Chinese Character Types
export enum ChineseGrade {
  LEVEL_6 = '6급',
  LEVEL_7 = '7급',
  LEVEL_8 = '8급'
}

export enum ChineseProblemType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  WRITING_PRACTICE = 'writing_practice'
}

export interface ChineseProblem {
  id: number;
  character: string;
  meaning: string;
  reading: string;
  options?: string[];
  answer: string;
}

export interface ChineseGeneratorConfig {
  count: number;
  grade: ChineseGrade;
  type: ChineseProblemType;
}

// English Types
export enum EnglishGrade {
  GRADE_2 = '2학년',
  GRADE_3 = '3학년'
}

export enum EnglishProblemType {
  VOCABULARY = '단어 퀴즈',
  SENTENCE_COMPLETION = '문장 완성',
  TRANSLATION = '영작 연습'
}

export interface EnglishProblem {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  hint?: string;
}

export interface EnglishGeneratorConfig {
  count: number;
  grade: EnglishGrade;
  type: EnglishProblemType;
}
