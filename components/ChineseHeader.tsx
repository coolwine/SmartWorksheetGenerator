import React from 'react';
import { ChineseGeneratorConfig, ChineseGrade, ChineseProblemType } from '../types';

interface ChineseHeaderProps {
  config: ChineseGeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<ChineseGeneratorConfig>>;
  isLoading: boolean;
  onGenerate: () => void;
  onPrint: () => void;
  hasProblems: boolean;
  commonClass: string;
  AnswerKeyToggle: React.ReactNode;
}

export const ChineseHeader: React.FC<ChineseHeaderProps> = ({
  config, setConfig, isLoading, onGenerate, onPrint, hasProblems, commonClass, AnswerKeyToggle
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex gap-2">
        <select 
          className={commonClass} 
          value={config.grade} 
          onChange={(e) => setConfig(p => ({ ...p, grade: e.target.value as ChineseGrade }))}
        >
          <option value={ChineseGrade.LEVEL_8}>8급</option>
          <option value={ChineseGrade.LEVEL_7}>7급</option>
          <option value={ChineseGrade.LEVEL_6}>6급</option>
        </select>
        <select 
          className={commonClass} 
          value={config.type} 
          onChange={(e) => setConfig(p => ({ ...p, type: e.target.value as ChineseProblemType }))}
        >
          <option value={ChineseProblemType.MULTIPLE_CHOICE}>객관식</option>
          <option value={ChineseProblemType.SHORT_ANSWER}>주관식</option>
          <option value={ChineseProblemType.WRITING_PRACTICE}>쓰기연습</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        {AnswerKeyToggle}
        <button 
          onClick={onGenerate} 
          disabled={isLoading} 
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-4 rounded text-sm disabled:opacity-50 active:scale-95 transition-all shadow-sm"
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
