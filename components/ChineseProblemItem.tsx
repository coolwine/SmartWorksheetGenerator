
import React from 'react';
import { ChineseProblem, ChineseProblemType } from '../types';
import { Density } from '../App';

interface Props {
  problem: ChineseProblem;
  index: number;
  type: ChineseProblemType;
  density: Density;
}

export const ChineseProblemItem: React.FC<Props> = ({ problem, index, type, density }) => {
  const isCompact = density === 'compact';
  const isRelaxed = density === 'relaxed';

  if (type === ChineseProblemType.WRITING_PRACTICE) {
    const boxSize = isCompact ? 'w-12 h-12 text-2xl' : isRelaxed ? 'w-24 h-24 text-5xl' : 'w-16 h-16 text-3xl';
    const numBoxes = isCompact ? 10 : isRelaxed ? 6 : 8;

    return (
      <div className={`flex items-center w-full relative gap-4 ${isCompact ? 'p-2' : isRelaxed ? 'p-6' : 'p-4'}`}>
        <span className="absolute top-1 left-1 text-[10px] text-slate-300 font-bold">{index + 1}</span>
        
        <div className="flex flex-col items-center shrink-0 ml-4">
          <div className={`${boxSize} font-serif border-2 border-slate-900 flex items-center justify-center bg-slate-50 relative shadow-sm`}>
            {problem.character}
          </div>
          <div className={`${isCompact ? 'text-[11px]' : 'text-[14px]'} font-bold text-slate-900 mt-1`}>{problem.meaning} {problem.reading}</div>
        </div>

        <div className="flex-1 flex gap-1 overflow-hidden py-1">
          {Array.from({ length: numBoxes }).map((_, i) => (
            <div key={i} className={`${boxSize} border border-slate-300 relative bg-white shrink-0 shadow-sm`}>
              {i === 0 && <span className="absolute inset-0 flex items-center justify-center font-serif text-slate-100 pointer-events-none opacity-50">{problem.character}</span>}
              <div className="absolute inset-0 border-t border-dashed border-slate-100 top-1/2 pointer-events-none"></div>
              <div className="absolute inset-0 border-l border-dashed border-slate-100 left-1/2 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col relative items-center justify-center ${isCompact ? 'p-2 min-h-[80px]' : isRelaxed ? 'p-8 min-h-[160px]' : 'p-4 min-h-[120px]'}`}>
      <span className="absolute top-1 left-1 text-[10px] text-slate-300 font-bold">{index + 1}</span>
      <div className={`${isCompact ? 'text-3xl mb-2' : isRelaxed ? 'text-6xl mb-6' : 'text-4xl mb-4'} font-serif text-slate-900`}>
        {problem.character}
      </div>
      
      {type === ChineseProblemType.MULTIPLE_CHOICE ? (
        <div className={`grid grid-cols-2 gap-x-2 w-full ${isCompact ? 'text-[10px]' : 'text-[13px]'}`}>
          {problem.options?.map((opt, i) => (
            <div key={i} className="flex gap-1 border-b border-slate-50 pb-0.5">
              <span className="font-black text-slate-400">({i + 1})</span>
              <span className="truncate">{opt}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${isCompact ? 'w-24' : 'w-32'} border-b-2 border-slate-300 h-6 flex items-center justify-center`}>
          <span className="text-[9px] text-slate-200">(뜻과 음을 쓰세요)</span>
        </div>
      )}
    </div>
  );
};
