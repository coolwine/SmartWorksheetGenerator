import React from 'react';
import { GeneratorConfig, OperationType, DigitMode, ProblemFormat } from '../types';

interface MathHeaderProps {
  config: GeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneratorConfig>>;
  isLoading: boolean;
  onGenerate: () => void;
  onPrint: () => void;
  hasProblems: boolean;
  commonClass: string;
  AnswerKeyToggle: React.ReactNode;
}

export const MathHeader: React.FC<MathHeaderProps> = ({
  config, setConfig, isLoading, onGenerate, onPrint, hasProblems, commonClass, AnswerKeyToggle
}) => {
  const isMultiplication = config.operation === OperationType.MULTIPLICATION;
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex gap-2">
        <select 
          className={commonClass} 
          value={config.operation} 
          onChange={(e) => setConfig(p => ({ ...p, operation: e.target.value as OperationType }))}
        >
          <option value={OperationType.ADDITION}>덧셈 (+)</option>
          <option value={OperationType.SUBTRACTION}>뺄셈 (-)</option>
          <option value={OperationType.MULTIPLICATION}>곱셈 (×)</option>
          <option value={OperationType.MIXED}>혼합 (+, -)</option>
        </select>
        <select 
          className={commonClass} 
          value={config.digitMode} 
          onChange={(e) => setConfig(p => ({ ...p, digitMode: e.target.value as DigitMode }))}
        >
          {isMultiplication ? (
            <>
              <option value={DigitMode.ONE_ONE}>1자리 × 1자리</option>
              <option value={DigitMode.TWO_TWO}>2자리 × 2자리</option>
              <option value={DigitMode.ONE_TWO}>1자리 & 2자리 혼합</option>
            </>
          ) : (
            <>
              <option value={DigitMode.TWO_TWO}>2자리 & 2자리</option>
              <option value={DigitMode.TWO_THREE}>2자리 & 3자리</option>
              <option value={DigitMode.THREE_THREE}>3자리 & 3자리</option>
            </>
          )}
        </select>
        <select 
          className={commonClass} 
          value={config.format} 
          onChange={(e) => setConfig(p => ({ ...p, format: e.target.value as ProblemFormat }))}
        >
          <option value={ProblemFormat.HORIZONTAL}>가로형</option>
          <option value={ProblemFormat.VERTICAL}>세로형</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        {AnswerKeyToggle}
        <button 
          onClick={onGenerate} 
          disabled={isLoading} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded text-sm disabled:opacity-50 min-w-[70px] shadow-sm active:scale-95 transition-all"
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
