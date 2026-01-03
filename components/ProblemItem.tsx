
import React from 'react';
import { MathProblem, ProblemFormat } from '../types';
import { Density } from '../App';

interface Props {
  problem: MathProblem;
  index: number;
  format: ProblemFormat;
  density: Density;
}

export const ProblemItem: React.FC<Props> = ({ problem, index, format, density }) => {
  const isCompact = density === 'compact';
  const isRelaxed = density === 'relaxed';

  const containerClasses = `flex relative w-full ${
    isCompact ? 'p-1 min-h-[70px]' : 
    isRelaxed ? 'p-6 min-h-[140px]' : 
    'p-3 min-h-[100px]'
  }`;

  const fontClasses = isCompact ? 'text-base' : isRelaxed ? 'text-3xl' : 'text-xl';
  const numberFont = "font-mono font-bold tracking-tighter";

  if (format === ProblemFormat.HORIZONTAL) {
    return (
      <div className={`${containerClasses} items-center justify-center`}>
        <span className="absolute top-1 left-1 text-[10px] text-slate-300 font-bold">{index + 1}</span>
        <div className={`${fontClasses} ${numberFont} flex items-center gap-2 pl-4`}>
          <span>{problem.num1}</span>
          <span className="opacity-50">{problem.operation}</span>
          <span>{problem.num2}</span>
          <span className="opacity-50">=</span>
          <div className={`${isCompact ? 'w-10' : 'w-20'} border-b-2 border-slate-300 h-1 mt-auto`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} flex-col items-end justify-center`}>
      <span className="absolute top-1 left-1 text-[10px] text-slate-300 font-bold">{index + 1}</span>
      <div className={`${fontClasses} ${numberFont} flex flex-col items-end mr-4`}>
        <span>{problem.num1}</span>
        <div className="flex items-center">
          <span className="mr-4 text-base opacity-40">{problem.operation}</span>
          <span>{problem.num2}</span>
        </div>
        <div className={`w-full h-[3px] bg-slate-900 mt-1`}></div>
      </div>
    </div>
  );
};
