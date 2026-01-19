import React from 'react';
import { EnglishGeneratorConfig, EnglishGrade, EnglishProblemType } from '../types';

interface EnglishHeaderProps {
  config: EnglishGeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<EnglishGeneratorConfig>>;
  isLoading: boolean;
  onGenerate: () => void;
  onPrint: () => void;
  hasProblems: boolean;
  commonClass: string;
  AnswerKeyToggle: React.ReactNode;
}

export const EnglishHeader: React.FC<EnglishHeaderProps> = ({
  config, setConfig, isLoading, onGenerate, onPrint, hasProblems, commonClass, AnswerKeyToggle
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex gap-2">
        <select 
          className={commonClass} 
          value={config.grade} 
          onChange={(e) => setConfig(p => ({ ...p, grade: e.target.value as EnglishGrade }))}
        >
          <option value={EnglishGrade.GRADE_2}>2학년</option>
          <option value={EnglishGrade.GRADE_3}>3학년</option>
        </select>
        <select 
          className={commonClass} 
          value={config.type} 
          onChange={(e) => setConfig(p => ({ ...p, type: e.target.value as EnglishProblemType }))}
        >
          <option value={EnglishProblemType.VOCABULARY}>단어 퀴즈</option>
          <option value={EnglishProblemType.SENTENCE_COMPLETION}>문장 완성</option>
          <option value={EnglishProblemType.TRANSLATION}>영작 연습</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        {AnswerKeyToggle}
        <button 
          onClick={onGenerate} 
          disabled={isLoading} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded text-sm disabled:opacity-50 active:scale-95 transition-all shadow-sm"
        >
          {isLoading ? "생성중" : "생성"}
        </button>
        {hasProblems && (
          <button 
            onClick={onPrint} 
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-4 rounded text-sm transition-all active:scale-95 shadow-sm"
          >
            인쇄하기
          </button>
        )}
      </div>
    </div>
  );
};
