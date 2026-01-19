
import React from 'react';
import { MathProblem, ProblemFormat } from '../types';
import { Density } from '../App';

interface Props {
  problem: MathProblem;
  index: number;
  format: ProblemFormat;
  density: Density;
  cols: number; // Added cols prop to adjust styles
}

export const ProblemItem: React.FC<Props> = ({ problem, index, format, density, cols }) => {
  const isCompact = density === 'compact' || cols >= 4;
  const isRelaxed = density === 'relaxed' && cols <= 2;
  const isExtraWide = cols === 1;

  // 3x14 layout: We need to fit 14 rows, so min-height should be around 50-60px
  const containerClasses = `flex relative w-full ${
    isCompact ? 'p-1 min-h-[50px] md:min-h-[55px] print:min-h-[52px]' : 
    isRelaxed ? 'p-5 min-h-[140px]' : 
    'p-3 min-h-[100px]'
  } ${isExtraWide ? 'justify-start pl-12' : 'justify-center'}`;

  // Font size adjustment based on columns and density
  const getFontSize = () => {
    if (cols >= 5) return 'text-xs';
    if (isCompact) return 'text-sm md:text-base print:text-[14px]'; // Slightly smaller for 3x14
    if (cols === 4) return 'text-base';
    if (isRelaxed) return 'text-3xl';
    return 'text-xl';
  };

  const fontClasses = getFontSize();
  const numberFont = "font-mono font-bold tracking-tighter";

  if (format === ProblemFormat.HORIZONTAL) {
    return (
      <div className={`${containerClasses} items-center`}>
        <span className="absolute top-0.5 left-0.5 text-[8px] text-slate-300 font-bold">{index + 1}</span>
        <div className={`${fontClasses} ${numberFont} flex items-center gap-1`}>
          <span>{problem.num1}</span>
          <span className="opacity-40 scale-90">{problem.operation}</span>
          <span>{problem.num2}</span>
          <span className="opacity-40 scale-90">=</span>
          <div className={`${
            cols >= 5 ? 'w-5' : 
            isCompact ? 'w-8' : 
            cols >= 4 ? 'w-10' : 
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
          <div>test23</div>
        </div>
        <div className={`w-full h-[1.5px] bg-slate-900 mt-0.5`}></div>
      </div>
    </div>
  );
};
