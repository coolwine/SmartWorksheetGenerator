import React from 'react';
import { 
  Subject, MathProblem, ChineseProblem, EnglishProblem, 
  GeneratorConfig, ChineseGeneratorConfig, EnglishGeneratorConfig,
  ChineseProblemType
} from '../types';
import { ProblemItem } from './ProblemItem';
import { ChineseProblemItem } from './ChineseProblemItem';
import { EnglishProblemItem } from './EnglishProblemItem';
import { Density } from '../App';

interface WorksheetProps {
  currentSubject: Subject;
  mathProblems: MathProblem[];
  chineseProblems: ChineseProblem[];
  englishProblems: EnglishProblem[];
  mathConfig: GeneratorConfig;
  chineseConfig: ChineseGeneratorConfig;
  englishConfig: EnglishGeneratorConfig;
  showAnswerKey: boolean;
  density: Density;
  gridColsClass: string;
}

export const Worksheet: React.FC<WorksheetProps> = ({
  currentSubject, mathProblems, chineseProblems, englishProblems,
  mathConfig, chineseConfig, englishConfig,
  showAnswerKey, density, gridColsClass
}) => {
  const currentProblems = currentSubject === Subject.MATH ? mathProblems : (currentSubject === Subject.CHINESE ? chineseProblems : englishProblems);
  const subjectTitle = { 
    [Subject.MATH]: "초등 산수 연산 연습장", 
    [Subject.CHINESE]: "한문 급수 학습지", 
    [Subject.ENGLISH]: "기초 영어 학습지", 
    [Subject.LANDING]: "" 
  }[currentSubject];
  
  const isWritingPractice = currentSubject === Subject.CHINESE && chineseConfig.type === ChineseProblemType.WRITING_PRACTICE;

  if (currentProblems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 text-slate-300 no-print">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        <p className="text-xl font-medium text-slate-400">상단에서 옵션을 선택하고 문제를 생성하세요.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className={`border-b-4 border-slate-900 flex justify-between items-end ${isWritingPractice ? 'pb-1 mb-1 print:mb-0.5' : 'pb-3 mb-6'}`}>
        <div>
          <h2 className={`${isWritingPractice ? 'text-2xl' : 'text-3xl'} font-black text-slate-900 tracking-tight`}>{subjectTitle}</h2>
          <div className="flex gap-2 mt-0.5">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">
              {currentSubject === Subject.MATH ? `2학년 산수 / 3열 14행` : (currentSubject === Subject.CHINESE ? `${chineseConfig.grade} / ${chineseConfig.type} / 1열 20행` : `${englishConfig.grade} / ${englishConfig.type} / 3열 5행`)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium no-print">AI Smart System</span>
          </div>
        </div>
        <div className={`flex gap-1 md:gap-3 text-[12px] font-bold border-2 border-slate-200 p-2 rounded-lg bg-slate-50 ${isWritingPractice ? 'scale-75 md:scale-90 origin-right' : ''}`}>
          <div className="min-w-[70px] text-center"><span className="text-[9px] text-slate-400 block mb-1">이름 (Name)</span><div className="h-5 border-b border-slate-300 mx-2"></div></div>
          <div className="min-w-[70px] text-center border-l-2 border-slate-200"><span className="text-[9px] text-slate-400 block mb-1">날짜 (Date)</span><div className="h-5 border-b border-slate-300 mx-2"></div></div>
          <div className="min-w-[70px] text-center border-l-2 border-slate-200"><span className="text-[9px] text-slate-400 block mb-1">점수 (Score)</span><div className="h-5 border-b border-slate-300 mx-2"></div></div>
        </div>
      </div>

      <div className={`grid ${gridColsClass} gap-0 border-t-2 border-l-2 border-slate-900`}>
        {currentSubject === Subject.MATH && (currentProblems as MathProblem[]).map((p, idx) => (
          <div key={p.id} className="problem-grid-item border-r-2 border-b-2 border-slate-900">
             <ProblemItem problem={p} index={idx} format={mathConfig.format} density={density} cols={3} />
          </div>
        ))}
        {currentSubject === Subject.CHINESE && (currentProblems as ChineseProblem[]).map((p, idx) => (
          <div key={idx} className="problem-grid-item border-r-2 border-b-2 border-slate-900">
             <ChineseProblemItem problem={p} index={idx} type={chineseConfig.type} density={density} />
          </div>
        ))}
        {currentSubject === Subject.ENGLISH && (currentProblems as EnglishProblem[]).map((p, idx) => (
          <div key={idx} className="problem-grid-item border-r-2 border-b-2 border-slate-900">
             <EnglishProblemItem problem={p} index={idx} type={englishConfig.type} density={density} cols={3} />
          </div>
        ))}
      </div>

      {showAnswerKey && (
        <div className={`answer-key-section mt-auto no-print:opacity-50 ${isWritingPractice ? 'pt-1 print:pt-0.5' : 'pt-4'}`}>
          <div className="border-t-2 border-dashed border-slate-200 pt-2 print:pt-1">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-[9px] font-black text-slate-800 uppercase w-full mb-0.5 border-b border-slate-100 pb-0.5">정답 확인 (Answer Key)</span>
              {currentProblems.map((p, i) => (
                <span key={i} className="text-[9px] text-slate-700 font-mono font-bold bg-slate-50 px-1 py-0.2 rounded border border-slate-200">
                  <span className="text-slate-400 mr-0.5">{i+1}.</span>
                  {p.answer}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
