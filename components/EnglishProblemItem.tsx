
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
  const isCompact = density === 'compact';
  const isRelaxed = density === 'relaxed';

  const containerPadding = isCompact ? 'p-2' : isRelaxed ? 'p-8' : 'p-4';
  const questionSize = isCompact ? 'text-sm' : isRelaxed ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex flex-col border-slate-900 relative ${containerPadding} min-h-[100px]`}>
      <span className="absolute top-1 left-1 text-[10px] text-slate-300 font-bold">{index + 1}</span>
      
      <div className="mt-2 pl-4">
        {/* Question */}
        <div className={`${questionSize} font-bold text-slate-900 mb-4 leading-tight`}>
          {type === EnglishProblemType.TRANSLATION ? (
            <span>다음 말을 영어로 쓰세요: <br/><span className="text-blue-700 font-black">"{problem.question}"</span></span>
          ) : (
            <span>{problem.question}</span>
          )}
        </div>

        {/* Options */}
        {problem.options && problem.options.length > 0 && (
          <div className={`grid grid-cols-2 gap-x-4 gap-y-1 mb-4 ${isCompact ? 'text-[11px]' : 'text-[14px]'}`}>
            {problem.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-1 border-b border-slate-50">
                <span className="font-black text-slate-400">({i + 1})</span> 
                <span className="font-medium">{opt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Writing Note Grid (English 4-line style) */}
        {(type === EnglishProblemType.TRANSLATION || !problem.options) && (
          <div className={`mt-4 w-full ${isRelaxed ? 'max-w-none' : 'max-w-md'}`}>
            <div className={`${isCompact ? 'h-[20px]' : 'h-[30px]'} border-b-2 border-slate-200`}></div>
            <div className={`${isCompact ? 'h-[10px]' : 'h-[15px]'} border-b border-dashed border-red-200`}></div>
            <div className={`${isCompact ? 'h-[10px]' : 'h-[15px]'} border-b-2 border-slate-200`}></div>
          </div>
        )}
      </div>
    </div>
  );
};
