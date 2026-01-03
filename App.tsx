
import React, { useState, useMemo } from 'react';
import { 
  Subject, DigitMode, OperationType, MathProblem, GeneratorConfig, ProblemFormat, 
  ChineseGrade, ChineseProblemType, ChineseGeneratorConfig, ChineseProblem,
  EnglishGrade, EnglishProblemType, EnglishGeneratorConfig, EnglishProblem
} from './types';
import { generateMathProblems, generateChineseProblems, generateEnglishProblems } from './services/geminiService';
import { ProblemItem } from './components/ProblemItem';
import { ChineseProblemItem } from './components/ChineseProblemItem';
import { EnglishProblemItem } from './components/EnglishProblemItem';

export type Density = 'compact' | 'normal' | 'relaxed';

const App: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.LANDING);
  
  // States
  const [mathConfig, setMathConfig] = useState<GeneratorConfig>({
    count: 20, digitMode: DigitMode.TWO_TWO, operation: OperationType.MIXED, format: ProblemFormat.HORIZONTAL
  });
  const [mathProblems, setMathProblems] = useState<MathProblem[]>([]);

  const [chineseConfig, setChineseConfig] = useState<ChineseGeneratorConfig>({
    count: 20, grade: ChineseGrade.LEVEL_8, type: ChineseProblemType.MULTIPLE_CHOICE
  });
  const [chineseProblems, setChineseProblems] = useState<ChineseProblem[]>([]);

  const [englishConfig, setEnglishConfig] = useState<EnglishGeneratorConfig>({
    count: 20, grade: EnglishGrade.GRADE_2, type: EnglishProblemType.VOCABULARY
  });
  const [englishProblems, setEnglishProblems] = useState<EnglishProblem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Density Calculation Logic
  const density: Density = useMemo(() => {
    let count = 0;
    if (currentSubject === Subject.MATH) count = mathProblems.length;
    else if (currentSubject === Subject.CHINESE) count = chineseProblems.length;
    else if (currentSubject === Subject.ENGLISH) count = englishProblems.length;

    if (count === 0) return 'normal';

    // Different threshold based on layout (one-column vs multi-column)
    const isSingleColumn = (currentSubject === Subject.CHINESE && chineseConfig.type === ChineseProblemType.WRITING_PRACTICE) || 
                          (currentSubject === Subject.ENGLISH && englishConfig.type === EnglishProblemType.TRANSLATION);

    if (isSingleColumn) {
      if (count > 15) return 'compact';
      if (count <= 8) return 'relaxed';
      return 'normal';
    } else {
      if (count > 40) return 'compact';
      if (count <= 20) return 'relaxed';
      return 'normal';
    }
  }, [currentSubject, mathProblems.length, chineseProblems.length, englishProblems.length, chineseConfig.type, englishConfig.type]);

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

  if (currentSubject === Subject.LANDING) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Smart Worksheet</h1>
          <p className="text-slate-600 text-lg">AI 기반 맞춤형 초등 학습지 생성기</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          {/* Math Card */}
          <button onClick={() => setCurrentSubject(Subject.MATH)} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all text-left flex flex-col h-full">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">수학 (Math)</h2>
            <p className="text-sm text-slate-500 mb-4 flex-grow">덧셈, 뺄셈 연산 능력을 키워주는 문제지</p>
            <span className="text-blue-600 text-sm font-bold">시작하기 →</span>
          </button>

          {/* Chinese Card */}
          <button onClick={() => setCurrentSubject(Subject.CHINESE)} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-500 transition-all text-left flex flex-col h-full">
            <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">한문 (Chinese)</h2>
            <p className="text-sm text-slate-500 mb-4 flex-grow">급수 한자 암기와 쓰기 연습</p>
            <span className="text-amber-600 text-sm font-bold">시작하기 →</span>
          </button>

          {/* English Card */}
          <button onClick={() => setCurrentSubject(Subject.ENGLISH)} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-500 transition-all text-left flex flex-col h-full">
            <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">영어 (English)</h2>
            <p className="text-sm text-slate-500 mb-4 flex-grow">기초 영단어와 짧은 문장 연습</p>
            <span className="text-emerald-600 text-sm font-bold">시작하기 →</span>
          </button>
        </div>
      </div>
    );
  }

  const renderHeaderControls = () => {
    const commonClass = "bg-slate-100 border-none rounded px-2 py-1.5 text-xs focus:ring-2 focus:ring-slate-300 transition-all outline-none";
    if (currentSubject === Subject.MATH) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <select className={commonClass} value={mathConfig.count} onChange={(e) => setMathConfig(p => ({ ...p, count: parseInt(e.target.value) }))}>
            {[10, 20, 30, 40, 50, 60].map(n => <option key={n} value={n}>{n}개</option>)}
          </select>
          <select className={commonClass} value={mathConfig.digitMode} onChange={(e) => setMathConfig(p => ({ ...p, digitMode: e.target.value as DigitMode }))}>
            <option value={DigitMode.TWO_TWO}>2자리&2자리</option>
            <option value={DigitMode.TWO_THREE}>2자리&3자리</option>
            <option value={DigitMode.THREE_THREE}>3자리&3자리</option>
          </select>
          <select className={commonClass} value={mathConfig.operation} onChange={(e) => setMathConfig(p => ({ ...p, operation: e.target.value as OperationType }))}>
            <option value={OperationType.ADDITION}>덧셈</option>
            <option value={OperationType.SUBTRACTION}>뺄셈</option>
            <option value={OperationType.MIXED}>혼합</option>
          </select>
          <button onClick={handleGenerateMath} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded text-sm disabled:opacity-50 min-w-[70px]">
            {isLoading ? "생성중" : "생성"}
          </button>
          {mathProblems.length > 0 && <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-4 rounded text-sm transition-all active:scale-95">인쇄하기</button>}
        </div>
      );
    }
    if (currentSubject === Subject.CHINESE) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <select className={commonClass} value={chineseConfig.count} onChange={(e) => setChineseConfig(p => ({ ...p, count: parseInt(e.target.value) }))}>
            {[10, 20, 30, 40].map(n => <option key={n} value={n}>{n}개</option>)}
          </select>
          <select className={commonClass} value={chineseConfig.grade} onChange={(e) => setChineseConfig(p => ({ ...p, grade: e.target.value as ChineseGrade }))}>
            <option value={ChineseGrade.LEVEL_8}>8급</option><option value={ChineseGrade.LEVEL_7}>7급</option><option value={ChineseGrade.LEVEL_6}>6급</option>
          </select>
          <select className={commonClass} value={chineseConfig.type} onChange={(e) => setChineseConfig(p => ({ ...p, type: e.target.value as ChineseProblemType }))}>
            <option value={ChineseProblemType.MULTIPLE_CHOICE}>객관식</option><option value={ChineseProblemType.SHORT_ANSWER}>주관식</option><option value={ChineseProblemType.WRITING_PRACTICE}>쓰기연습</option>
          </select>
          <button onClick={handleGenerateChinese} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-4 rounded text-sm disabled:opacity-50">
            {isLoading ? "생성중" : "생성"}
          </button>
          {chineseProblems.length > 0 && <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-4 rounded text-sm transition-all active:scale-95">인쇄하기</button>}
        </div>
      );
    }
    if (currentSubject === Subject.ENGLISH) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <select className={commonClass} value={englishConfig.count} onChange={(e) => setEnglishConfig(p => ({ ...p, count: parseInt(e.target.value) }))}>
            {[10, 20, 30, 40].map(n => <option key={n} value={n}>{n}개</option>)}
          </select>
          <select className={commonClass} value={englishConfig.grade} onChange={(e) => setEnglishConfig(p => ({ ...p, grade: e.target.value as EnglishGrade }))}>
            <option value={EnglishGrade.GRADE_2}>2학년</option><option value={EnglishGrade.GRADE_3}>3학년</option>
          </select>
          <select className={commonClass} value={englishConfig.type} onChange={(e) => setEnglishConfig(p => ({ ...p, type: e.target.value as EnglishProblemType }))}>
            <option value={EnglishProblemType.VOCABULARY}>단어 퀴즈</option><option value={EnglishProblemType.SENTENCE_COMPLETION}>문장 완성</option><option value={EnglishProblemType.TRANSLATION}>영작 연습</option>
          </select>
          <button onClick={handleGenerateEnglish} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded text-sm disabled:opacity-50">
            {isLoading ? "생성중" : "생성"}
          </button>
          {englishProblems.length > 0 && <button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-4 rounded text-sm transition-all active:scale-95">인쇄하기</button>}
        </div>
      );
    }
  };

  const currentProblems = currentSubject === Subject.MATH ? mathProblems : (currentSubject === Subject.CHINESE ? chineseProblems : englishProblems);
  const subjectIcon = { [Subject.MATH]: "bg-blue-600", [Subject.CHINESE]: "bg-amber-600", [Subject.ENGLISH]: "bg-emerald-600", [Subject.LANDING]: "" }[currentSubject];
  const subjectTitle = { [Subject.MATH]: "초등 산수 연산 연습장", [Subject.CHINESE]: "한문 급수 학습지", [Subject.ENGLISH]: "기초 영어 학습지", [Subject.LANDING]: "" }[currentSubject];

  return (
    <div className="min-h-screen pb-10">
      <header className="no-print bg-white border-b sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentSubject(Subject.LANDING)} className="p-1.5 hover:bg-slate-100 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className={`${subjectIcon} p-1.5 rounded-md text-white shadow-sm`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">{currentSubject.toUpperCase()}</h1>
            </div>
          </div>
          {renderHeaderControls()}
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-4 md:mt-8 bg-white shadow-xl min-h-[29.7cm] p-[0.5cm] md:p-[1cm] border border-slate-200 print:m-0 print:p-[5mm] print:max-w-none print:shadow-none print:border-none print:w-full">
        {currentProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-40 text-slate-300 no-print animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-xl font-medium">상단에서 옵션을 선택하고 문제를 생성하세요.</p>
          </div>
        ) : (
          <div className="relative h-full flex flex-col">
            {/* Worksheet Header */}
            <div className="border-b-4 border-slate-900 pb-3 mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{subjectTitle}</h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">
                    {currentSubject === Subject.MATH ? `${mathConfig.digitMode} / ${mathConfig.operation}` : (currentSubject === Subject.CHINESE ? `${chineseConfig.grade} / ${chineseConfig.type}` : `${englishConfig.grade} / ${englishConfig.type}`)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Generated by AI Smart System</span>
                </div>
              </div>
              <div className="flex gap-1 md:gap-3 text-[12px] font-bold border-2 border-slate-200 p-2 rounded-lg bg-slate-50">
                <div className="min-w-[70px] text-center"><span className="text-[9px] text-slate-400 block mb-1">이름 (Name)</span><div className="h-5 border-b border-slate-300 mx-2"></div></div>
                <div className="min-w-[70px] text-center border-l-2 border-slate-200"><span className="text-[9px] text-slate-400 block mb-1">날짜 (Date)</span><div className="h-5 border-b border-slate-300 mx-2"></div></div>
                <div className="min-w-[70px] text-center border-l-2 border-slate-200"><span className="text-[9px] text-slate-400 block mb-1">점수 (Score)</span><div className="h-5 border-b border-slate-300 mx-2"></div></div>
              </div>
            </div>

            {/* Problems Grid */}
            <div className={`grid ${
              (currentSubject === Subject.CHINESE && chineseConfig.type === ChineseProblemType.WRITING_PRACTICE) || 
              (currentSubject === Subject.ENGLISH && englishConfig.type === EnglishProblemType.TRANSLATION)
                ? 'grid-cols-1' 
                : currentSubject === Subject.MATH && mathConfig.format === ProblemFormat.VERTICAL 
                  ? (density === 'compact' ? 'grid-cols-5' : 'grid-cols-4')
                  : 'grid-cols-2'
              } gap-0 border-t-2 border-l-2 border-slate-900`}>
              {currentSubject === Subject.MATH && (currentProblems as MathProblem[]).map((p, idx) => (
                <div key={p.id} className="problem-grid-item border-r-2 border-b-2 border-slate-900">
                   <ProblemItem problem={p} index={idx} format={mathConfig.format} density={density} />
                </div>
              ))}
              {currentSubject === Subject.CHINESE && (currentProblems as ChineseProblem[]).map((p, idx) => (
                <div key={idx} className="problem-grid-item border-r-2 border-b-2 border-slate-900">
                   <ChineseProblemItem problem={p} index={idx} type={chineseConfig.type} density={density} />
                </div>
              ))}
              {currentSubject === Subject.ENGLISH && (currentProblems as EnglishProblem[]).map((p, idx) => (
                <div key={idx} className="problem-grid-item border-r-2 border-b-2 border-slate-900">
                   <EnglishProblemItem problem={p} index={idx} type={englishConfig.type} density={density} />
                </div>
              ))}
            </div>

            {/* Answer Key Section (Stays at the bottom or on new page if needed) */}
            <div className="answer-key-section mt-auto pt-10 no-print:opacity-50">
               <div className="border-t-2 border-dashed border-slate-200 pt-4">
                 <div className="flex flex-wrap gap-x-4 gap-y-2">
                   <span className="text-[12px] font-black text-slate-800 uppercase w-full mb-1 border-b border-slate-100 pb-1">정답 확인 (Answer Key)</span>
                   {currentProblems.map((p, i) => (
                     <span key={i} className="text-[11px] text-slate-700 font-mono font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                       <span className="text-slate-400 mr-1">{i+1}.</span>
                       {'answer' in p ? p.answer : ''}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>
      <footer className="no-print mt-8 text-center text-slate-400 text-[12px]">
        <p>© 2024 AI Smart Worksheet Generator. 최적화된 학습 환경을 제공합니다.</p>
      </footer>
    </div>
  );
};

export default App;
