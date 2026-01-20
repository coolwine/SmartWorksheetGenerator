
import React from 'react';
import { MathProblem, ProblemFormat } from '../types';
import { Density } from '../App';
import {createLogger} from "vite";

interface Props {
  problem: MathProblem;
  index: number;
  format: ProblemFormat;
  density: Density;
}

export const ProblemItem: React.FC<Props> = ({ problem, index, format, density }) => {
  const isCompact = density === 'compact';
  const isRelaxed = density === 'relaxed';
  const isExtraWide = false; // Math is fixed to 3 columns, so not extra wide

  // 3x14 layout: We need to fit 14 rows, so min-height should be around 50-60px
  const containerClasses = `flex relative w-full ${
    isCompact ? 'p-1 min-h-[50px] md:min-h-[55px]' : 
    isRelaxed ? 'p-5 min-h-[140px]' : 
    'p-3 min-h-[100px]'
  } ${isExtraWide ? 'justify-start pl-12' : 'justify-center'}`;

  // Font size adjustment based on density
  const getFontSize = () => {
    if (isCompact) return 'text-lg md:text-base print:text-base'; // Smaller on mobile
    if (isRelaxed) return 'text-2xl md:text-3xl print:text-3xl';
    return 'text-lg md:text-xl print:text-xl';
  };

  const fontClasses = getFontSize();
  const numberFont = "font-mono font-bold tracking-tighter";

  if (format === ProblemFormat.HORIZONTAL) {
    return (
      <div className={`${containerClasses} items-center`}>
        <span className="absolute top-0.5 left-0.5 text-[14px] text-slate-300 font-bold">{index + 1}</span>
        <div className={`${fontClasses} ${numberFont} flex items-center gap-1`}>
          <span className="text-sm md:text-xl lg:text-2xl print:text-2xl">{problem.num1}</span>
          <span className="opacity-40 scale-90">{problem.operation}</span>
          <span className="text-sm md:text-xl lg:text-2xl print:text-2xl">{problem.num2}</span>
          <span className="opacity-40 scale-90">=</span>
          <div className={`${
            isCompact ? 'w-8' : 
            isRelaxed ? 'w-24' : 'w-16'
          } border-b border-slate-300 h-0.5 mt-auto`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} flex-col items-end`}>
      <span className="absolute top-0.5 left-0.5 text-[8px] text-slate-300 font-bold">{index + 1}</span>
      <div className={`${fontClasses} ${numberFont} flex flex-col items-end ${isExtraWide ? 'mr-auto ml-10' : 'mr-2'}`}>
        <div className="leading-none">{problem.num1}</div>
        <div className="flex items-center leading-none mt-0.5">
          <span className={`${isCompact ? 'mr-1.5 text-[10px]' : 'mr-4 text-sm'} opacity-30`}>{problem.operation}</span>
          <span>{problem.num2}</span>
        </div>
        <div className={`w-full h-[1.5px] bg-slate-900 mt-0.5`}></div>
      </div>
    </div>
  );
};
