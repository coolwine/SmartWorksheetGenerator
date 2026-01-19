
import React from 'react';
import { EnglishProblem, EnglishProblemType } from '../types';
import { Density } from '../App';

interface Props {
  problem: EnglishProblem;
  index: number;
  type: EnglishProblemType;
  density: Density;
}

export const EnglishProblemItem: React.FC<Props> = ({ problem, index, type, density }) => {
  const isCompact = true; // Always compact to match Math style
  
  // Math-like container classes
  const containerClasses = `flex relative w-full items-center p-1.5 min-h-[50px] md:min-h-[55px]`;
  
  // Question text size
  const questionSize = 'text-[12px] md:text-[13px]';

  return (
    <div className={containerClasses}>
      <span className="absolute top-0.5 left-0.5 text-[10px] text-slate-300 font-bold">{index + 1}</span>
      
      <div className="pl-5 w-full flex flex-col justify-center">
        {/* Question and Options in a compact layout */}
        <div className="flex flex-col gap-0.5">
          <div className={`${questionSize} font-bold text-slate-900 leading-tight`}>
            {type === EnglishProblemType.TRANSLATION ? (
              <span className="text-blue-700">"{problem.question}" <span className="text-[10px] text-slate-400 font-normal">(영어로)</span></span>
            ) : (
              <span>{problem.question}</span>
            )}
          </div>

          {/* Options (Vocabulary or Sentence Completion) */}
          {problem.options && problem.options.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 text-[10px] md:text-[11px]">
              {problem.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
                  <span className="font-black text-slate-400 shrink-0">({i + 1})</span> 
                  <span className="font-medium truncate text-slate-600">{opt}</span>
                </div>
              ))}
            </div>
          )}

          {/* Answer Line for Translation */}
          {type === EnglishProblemType.TRANSLATION && (
            <div className="w-full border-b border-slate-200 h-4 mt-1"></div>
          )}
        </div>
      </div>
    </div>
  );
};
