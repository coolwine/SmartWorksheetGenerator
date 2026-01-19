
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Subject, DigitMode, OperationType, MathProblem, GeneratorConfig, ProblemFormat, 
  ChineseGrade, ChineseProblemType, ChineseGeneratorConfig, ChineseProblem,
  EnglishGrade, EnglishProblemType, EnglishGeneratorConfig, EnglishProblem
} from './types';
import { generateMathProblems, generateChineseProblems, generateEnglishProblems } from './services/geminiService';
import { LandingPage } from './components/LandingPage';
import { MathHeader } from './components/MathHeader';
import { ChineseHeader } from './components/ChineseHeader';
import { EnglishHeader } from './components/EnglishHeader';
import { Worksheet } from './components/Worksheet';

export type Density = 'compact' | 'normal' | 'relaxed';

const App: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.LANDING);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);
  
  // Math: Fixed to 42 problems
  const [mathConfig, setMathConfig] = useState<GeneratorConfig>({
    count: 42, digitMode: DigitMode.TWO_TWO, operation: OperationType.MIXED, format: ProblemFormat.HORIZONTAL
  });
  const [mathProblems, setMathProblems] = useState<MathProblem[]>([]);

  // Chinese: Fixed to 20 for 1-column layout as requested
  const [chineseConfig, setChineseConfig] = useState<ChineseGeneratorConfig>({
    count: 15, grade: ChineseGrade.LEVEL_8, type: ChineseProblemType.MULTIPLE_CHOICE
  });
  const [chineseProblems, setChineseProblems] = useState<ChineseProblem[]>([]);

  // English: Now matches Math (42 problems, 3x14)
  const [englishConfig, setEnglishConfig] = useState<EnglishGeneratorConfig>({
    count: 42, grade: EnglishGrade.GRADE_2, type: EnglishProblemType.VOCABULARY
  });
  const [englishProblems, setEnglishProblems] = useState<EnglishProblem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Sync math digitMode when operation changes
  useEffect(() => {
    if (mathConfig.operation === OperationType.MULTIPLICATION) {
      if (![DigitMode.ONE_ONE, DigitMode.TWO_TWO, DigitMode.ONE_TWO].includes(mathConfig.digitMode)) {
        setMathConfig(p => ({ ...p, digitMode: DigitMode.ONE_ONE }));
      }
    } else {
      if (![DigitMode.TWO_TWO, DigitMode.TWO_THREE, DigitMode.THREE_THREE].includes(mathConfig.digitMode)) {
        setMathConfig(p => ({ ...p, digitMode: DigitMode.TWO_TWO }));
      }
    }
  }, [mathConfig.operation]);

  const isWritingPractice = currentSubject === Subject.CHINESE && chineseConfig.type === ChineseProblemType.WRITING_PRACTICE;

  const gridColsClass = useMemo(() => {
    if (currentSubject === Subject.MATH) return 'grid-cols-3';
    if (currentSubject === Subject.CHINESE) return 'grid-cols-1'; // Always 1 column for Chinese now
    if (currentSubject === Subject.ENGLISH) return 'grid-cols-3';
    return 'grid-cols-3';
  }, [currentSubject]);

  const density: Density = useMemo(() => {
    let count = 0;
    if (currentSubject === Subject.MATH) count = mathProblems.length;
    else if (currentSubject === Subject.CHINESE) count = chineseProblems.length;
    else if (currentSubject === Subject.ENGLISH) count = englishProblems.length;

    if (count === 0) return 'normal';
    if (currentSubject === Subject.CHINESE) return 'compact'; // Always compact for 20 problems
    
    if (count >= 40) return 'compact';
    if (count >= 24) return 'compact';
    return 'normal';
  }, [currentSubject, mathProblems.length, chineseProblems.length, englishProblems.length]);

  const handleGenerateMath = async () => {
    setIsLoading(true);
    try {
      const result = await generateMathProblems(mathConfig);
      setMathProblems(result);
    } catch (err) { alert("오류 발생"); } finally { setIsLoading(false); }
  };

  const handleGenerateChinese = async () => {
    setIsLoading(true);
    try {
      const result = await generateChineseProblems(chineseConfig);
      setChineseProblems(result);
    } catch (err) { alert("오류 발생"); } finally { setIsLoading(false); }
  };

  const handleGenerateEnglish = async () => {
    setIsLoading(true);
    try {
      const result = await generateEnglishProblems(englishConfig);
      setEnglishProblems(result);
    } catch (err) { alert("오류 발생"); } finally { setIsLoading(false); }
  };

  const handlePrint = () => window.print();

  const renderHeaderControls = () => {
    const commonClass = "bg-slate-100 border-none rounded px-2 py-1.5 text-xs font-medium focus:ring-2 focus:ring-slate-300 transition-all outline-none cursor-pointer hover:bg-slate-200";
    const checkboxLabelClass = "flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none";
    
    const AnswerKeyToggle = (
      <label className={checkboxLabelClass}>
        <input 
          type="checkbox" 
          checked={showAnswerKey} 
          onChange={(e) => setShowAnswerKey(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        정답 포함
      </label>
    );

    if (currentSubject === Subject.MATH) {
      return (
        <MathHeader 
          config={mathConfig} setConfig={setMathConfig} isLoading={isLoading}
          onGenerate={handleGenerateMath} onPrint={handlePrint}
          hasProblems={mathProblems.length > 0} commonClass={commonClass} AnswerKeyToggle={AnswerKeyToggle}
        />
      );
    }
    
    if (currentSubject === Subject.CHINESE) {
      return (
        <ChineseHeader 
          config={chineseConfig} setConfig={setChineseConfig} isLoading={isLoading}
          onGenerate={handleGenerateChinese} onPrint={handlePrint}
          hasProblems={chineseProblems.length > 0} commonClass={commonClass} AnswerKeyToggle={AnswerKeyToggle}
        />
      );
    }
    
    if (currentSubject === Subject.ENGLISH) {
      return (
        <EnglishHeader 
          config={englishConfig} setConfig={setEnglishConfig} isLoading={isLoading}
          onGenerate={handleGenerateEnglish} onPrint={handlePrint}
          hasProblems={englishProblems.length > 0} commonClass={commonClass} AnswerKeyToggle={AnswerKeyToggle}
        />
      );
    }
    return null;
  };

  const subjectIcon = { [Subject.MATH]: "bg-blue-600", [Subject.CHINESE]: "bg-amber-600", [Subject.ENGLISH]: "bg-emerald-600", [Subject.LANDING]: "bg-slate-200" }[currentSubject];

  if (currentSubject === Subject.LANDING) {
    return <LandingPage onSelectSubject={setCurrentSubject} />;
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="no-print bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentSubject(Subject.LANDING)} className="p-1.5 hover:bg-slate-100 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className={`${subjectIcon} p-1.5 rounded-md text-white shadow-sm`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight capitalize">{currentSubject}</h1>
            </div>
          </div>
          {renderHeaderControls()}
        </div>
      </header>

      <main className={`max-w-4xl mx-auto mt-4 md:mt-8 bg-white shadow-xl min-h-[29.7cm] border border-slate-200 ${isWritingPractice ? 'p-[0.2cm] md:p-[0.4cm]' : 'p-[0.5cm] md:p-[1cm]'}`}>
        <Worksheet 
          currentSubject={currentSubject}
          mathProblems={mathProblems}
          chineseProblems={chineseProblems}
          englishProblems={englishProblems}
          mathConfig={mathConfig}
          chineseConfig={chineseConfig}
          englishConfig={englishConfig}
          showAnswerKey={showAnswerKey}
          density={density}
          gridColsClass={gridColsClass}
          isLoading={isLoading}
        />
      </main>
      <footer className="no-print mt-8 text-center text-slate-400 text-[12px]">
        <p>© 2024 AI Smart Worksheet Generator. 최적화된 학습 환경을 제공합니다.</p>
      </footer>
    </div>
  );
};

export default App;
