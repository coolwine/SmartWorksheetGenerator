
import { GoogleGenAI, Type } from "@google/genai";
import { 
  DigitMode, 
  OperationType, 
  MathProblem, 
  GeneratorConfig, 
  ChineseGeneratorConfig, 
  ChineseProblem, 
  ChineseProblemType,
  EnglishGeneratorConfig,
  EnglishProblem,
  EnglishProblemType,
  EnglishGrade
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMathProblems = async (config: GeneratorConfig): Promise<MathProblem[]> => {
  const digitContext = {
    [DigitMode.ONE_ONE]: "Both numbers must be 1 digit (1-9).",
    [DigitMode.ONE_TWO]: "One number must be 1 digit (1-9) and the other 2 digits (10-99).",
    [DigitMode.TWO_TWO]: "Both numbers must be 2 digits (10-99).",
    [DigitMode.TWO_THREE]: "One number must be 2 digits and the other 3 digits.",
    [DigitMode.THREE_THREE]: "Both numbers must be 3 digits (100-999)."
  }[config.digitMode];

  const operationContext = {
    [OperationType.ADDITION]: "Addition only (+).",
    [OperationType.SUBTRACTION]: "Subtraction only (-). Ensure the first number is larger than the second.",
    [OperationType.MULTIPLICATION]: "Multiplication only (×).",
    [OperationType.MIXED]: "A mix of addition and subtraction (+, -)."
  }[config.operation];

  const prompt = `Generate ${config.count} elementary math problems for 2nd graders.
    Rules:
    1. ${digitContext}
    2. ${operationContext}
    3. For subtraction, results must be positive (num1 >= num2).
    4. For multiplication, use the '×' symbol.
    5. Provide the exact answer for each.
    Return as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              num1: { type: Type.INTEGER },
              num2: { type: Type.INTEGER },
              operation: { type: Type.STRING, enum: ["+", "-", "×"] },
              answer: { type: Type.INTEGER }
            },
            required: ["num1", "num2", "operation", "answer"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return results.map((item: any, index: number) => ({
      ...item,
      id: index + 1
    }));
  } catch (error) {
    console.error("Gemini math generation failed, falling back to local generator", error);
    return generateMathLocally(config);
  }
};

export const generateChineseProblems = async (config: ChineseGeneratorConfig): Promise<ChineseProblem[]> => {
  const typeContext = {
    [ChineseProblemType.MULTIPLE_CHOICE]: "Multiple choice (객관식). Provide a character and 4 options for its meaning/reading (뜻과 음). RANDOMIZE the position of the correct answer in the options array.",
    [ChineseProblemType.SHORT_ANSWER]: "Short answer (주관식). Provide a character and ask for its meaning/reading (뜻과 음).",
    [ChineseProblemType.WRITING_PRACTICE]: "Writing practice (쓰기연습). Provide character, meaning, and reading for tracing/writing practice."
  }[config.type];

  const prompt = `Generate ${config.count} Chinese character (Hanja) study problems for Grade ${config.grade} (South Korean Hanja proficiency test level).
    Type: ${typeContext}
    Rules:
    - Use characters suitable for ${config.grade}.
    - Meanings and readings should be in Korean.
    - For multiple choice, DO NOT always put the answer at the first position.
    - Return as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              character: { type: Type.STRING },
              meaning: { type: Type.STRING },
              reading: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING }
            },
            required: ["character", "meaning", "reading", "answer"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return results.map((item: any, index: number) => ({
      ...item,
      id: index + 1
    }));
  } catch (error) {
    console.error("Gemini Chinese generation failed", error);
    throw error;
  }
};

export const generateEnglishProblems = async (config: EnglishGeneratorConfig): Promise<EnglishProblem[]> => {
  const typeContext = {
    [EnglishProblemType.VOCABULARY]: "Vocabulary quiz. Given a word, provide 4 Korean options. The 'answer' MUST be the full text of the correct Korean meaning.",
    [EnglishProblemType.SENTENCE_COMPLETION]: "Sentence completion. A simple sentence with (____) and 4 options. The 'answer' MUST be the full English word to fill in.",
    [EnglishProblemType.TRANSLATION]: "Basic translation. A Korean sentence to be translated. The 'answer' MUST be the correct English sentence."
  }[config.type];

  const gradeContext = config.grade === EnglishGrade.GRADE_2 
    ? "Level: Very basic English for 2nd graders (colors, animals, family, simple greetings, simple verbs)."
    : "Level: Basic English for 3rd graders (daily routines, hobbies, simple sentences, common objects).";

  const prompt = `Generate ${config.count} unique English study problems.
    Grade: ${config.grade}
    Problem Type: ${typeContext}
    ${gradeContext}
    
    CRITICAL RULES FOR MULTIPLE CHOICE (Vocabulary/Sentence Completion):
    1. The 'options' array MUST contain exactly 4 choices.
    2. The 'answer' field MUST match one of the strings in the 'options' array perfectly.
    3. RANDOMIZE the position of the correct answer within the 'options' array (index 0 to 3).
    4. DO NOT ALWAYS PUT THE CORRECT ANSWER AT THE FIRST POSITION (index 0). 
    5. Ensure the other 3 options (distractors) are plausible but clearly incorrect.
    
    OTHER RULES:
    - The 'answer' field MUST NOT be a single digit like '1'. It MUST be the actual correct string.
    - Ensure high variety. Do not repeat words.
    - Return as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              hint: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return results.map((item: any, index: number) => ({
      ...item,
      id: index + 1
    }));
  } catch (error) {
    console.error("Gemini English generation failed", error);
    throw error;
  }
};

const generateMathLocally = (config: GeneratorConfig): MathProblem[] => {
  const problems: MathProblem[] = [];
  const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  for (let i = 0; i < config.count; i++) {
    let n1, n2;
    if (config.digitMode === DigitMode.ONE_ONE) {
      n1 = getRandom(1, 9);
      n2 = getRandom(1, 9);
    } else if (config.digitMode === DigitMode.ONE_TWO) {
      n1 = getRandom(1, 9);
      n2 = getRandom(10, 99);
      if (Math.random() > 0.5) [n1, n2] = [n2, n1];
    } else if (config.digitMode === DigitMode.TWO_TWO) {
      n1 = getRandom(10, 99);
      n2 = getRandom(10, 99);
    } else if (config.digitMode === DigitMode.TWO_THREE) {
      n1 = getRandom(100, 999);
      n2 = getRandom(10, 99);
    } else {
      n1 = getRandom(100, 999);
      n2 = getRandom(100, 999);
    }

    let op: '+' | '-' | '×' = '+';
    if (config.operation === OperationType.ADDITION) op = '+';
    else if (config.operation === OperationType.SUBTRACTION) op = '-';
    else if (config.operation === OperationType.MULTIPLICATION) op = '×';
    else if (config.operation === OperationType.MIXED) op = Math.random() > 0.5 ? '+' : '-';

    if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];

    let ans = 0;
    if (op === '+') ans = n1 + n2;
    else if (op === '-') ans = n1 - n2;
    else ans = n1 * n2;

    problems.push({
      id: i + 1,
      num1: n1,
      num2: n2,
      operation: op,
      answer: ans
    });
  }
  return problems;
};
