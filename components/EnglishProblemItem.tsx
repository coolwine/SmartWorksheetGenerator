
import React from 'react';
import { EnglishProblem, EnglishProblemType } from '../types';
import { Density } from '../App';

interface Props {
  problem: EnglishProblem;
  index: number;
  type: EnglishProblemType;
  density: Density;
  cols: number;
}

export const EnglishProblemItem: React.FC<Props> = ({ problem, index, type, density, cols }) => {
  // Reduced row height for 3x5 layout
  const containerPadding = 'p-3 md:p-4 print:p-3.5';
  
  // Question text size
  const questionSize = 'text-[13px] md:text-[15px] print:text-[14px]';

  return (
    <div className={`flex flex-col border-slate-900 relative ${containerPadding} min-h-[135px] md:min-h-[155px] print:min-h-[145px]`}>
      <span className="absolute top-1 left-1 text-[8px] text-slate-300 font-bold">{index + 1}</span>
      
      <div className="pl-3 h-full flex flex-col">
        {/* Question */}
        <div className={`${questionSize} font-bold text-slate-900 mb-2 md:mb-3 leading-snug`}>
          {type === EnglishProblemType.TRANSLATION ? (
            <span className="block">영어로 쓰세요:<br/><span className="text-blue-700 font-black text-sm md:text-lg print:text-base">"{problem.question}"</span></span>
          ) : (
            <span className="block">{problem.question}</span>
          )}
        </div>

        {/* Options (Vocabulary or Sentence Completion) */}
        {problem.options && problem.options.length > 0 && (
          <div className="grid grid-cols-1 gap-y-1 mt-auto text-[11px] md:text-[13px] print:text-[12px]">
            {problem.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 border-b border-slate-50 overflow-hidden py-0.5 hover:bg-slate-50 transition-colors">
                <span className="font-black text-slate-400 shrink-0">({i + 1})</span> 
                <span className="font-medium truncate">{opt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Writing Note Grid (English 4-line style for Translation or when no options) */}
        {(type === EnglishProblemType.TRANSLATION || !problem.options) && (
          <div className="mt-auto w-full opacity-80 pt-2">
            <div className="h-[16px] print:h-[16px] border-b border-slate-200"></div>
            <div className="h-[11px] print:h-[11px] border-b border-dashed border-red-200"></div>
            <div className="h-[11px] print:h-[11px] border-b border-slate-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};
