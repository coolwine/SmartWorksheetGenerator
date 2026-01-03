
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
    [DigitMode.TWO_TWO]: "Both numbers must be 2 digits (10-99).",
    [DigitMode.TWO_THREE]: "One number must be 2 digits and the other 3 digits.",
    [DigitMode.THREE_THREE]: "Both numbers must be 3 digits (100-999)."
  }[config.digitMode];

  const operationContext = {
    [OperationType.ADDITION]: "Addition only.",
    [OperationType.SUBTRACTION]: "Subtraction only. Ensure the first number is larger than the second.",
    [OperationType.MIXED]: "A mix of addition and subtraction."
  }[config.operation];

  const prompt = `Generate ${config.count} elementary math problems for 2nd graders.
    Rules:
    1. ${digitContext}
    2. ${operationContext}
    3. For subtraction, results must be positive (num1 >= num2).
    4. Provide the exact answer for each.
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
              operation: { type: Type.STRING, enum: ["+", "-"] },
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
    [ChineseProblemType.MULTIPLE_CHOICE]: "Multiple choice (객관식). Provide a character and 4 options for its meaning/reading (뜻과 음).",
    [ChineseProblemType.SHORT_ANSWER]: "Short answer (주관식). Provide a character and ask for its meaning/reading (뜻과 음).",
    [ChineseProblemType.WRITING_PRACTICE]: "Writing practice (쓰기연습). Provide character, meaning, and reading for tracing/writing practice."
  }[config.type];

  const prompt = `Generate ${config.count} Chinese character (Hanja) study problems for Grade ${config.grade} (South Korean Hanja proficiency test level).
    Type: ${typeContext}
    Rules:
    - Use characters suitable for ${config.grade}.
    - Meanings and readings should be in Korean.
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
    [EnglishProblemType.VOCABULARY]: "Vocabulary quiz. Given an English word suitable for Grade ${config.grade}, provide 4 Korean meaning options.",
    [EnglishProblemType.SENTENCE_COMPLETION]: "Sentence completion. A simple sentence with a blank (____) and 4 options to fill it.",
    [EnglishProblemType.TRANSLATION]: "Basic translation. A simple Korean sentence to be translated into English."
  }[config.type];

  const gradeContext = config.grade === EnglishGrade.GRADE_2 
    ? "Level: Very basic English for 2nd graders (colors, animals, family, simple greetings)."
    : "Level: Basic English for 3rd graders (daily routines, hobbies, simple sentences like 'I like...').";

  const prompt = `Generate ${config.count} English study problems for elementary students in South Korea.
    Grade: ${config.grade}
    Problem Type: ${typeContext}
    ${gradeContext}
    Return as a JSON array. Include question, options (if multiple choice), and the answer.`;

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
    if (config.digitMode === DigitMode.TWO_TWO) {
      n1 = getRandom(10, 99);
      n2 = getRandom(10, 99);
    } else if (config.digitMode === DigitMode.TWO_THREE) {
      n1 = getRandom(100, 999);
      n2 = getRandom(10, 99);
    } else {
      n1 = getRandom(100, 999);
      n2 = getRandom(100, 999);
    }

    let op: '+' | '-' = '+';
    if (config.operation === OperationType.SUBTRACTION) op = '-';
    else if (config.operation === OperationType.MIXED) op = Math.random() > 0.5 ? '+' : '-';

    if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];

    problems.push({
      id: i + 1,
      num1: n1,
      num2: n2,
      operation: op,
      answer: op === '+' ? n1 + n2 : n1 - n2
    });
  }
  return problems;
};
