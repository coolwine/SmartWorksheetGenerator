
import React from 'react';
import { ChineseProblem, ChineseProblemType } from '../types';

interface Props {
  problem: ChineseProblem;
  index: number;
  type: ChineseProblemType;
}

const WritingPracticeItem: React.FC<{ problem: ChineseProblem; index: number }> = ({ problem, index }) => (
  <div className="flex w-full relative items-center border-b-2 border-slate-900 last:border-b-0 p-0">
    <span className="absolute top-0.5 left-0.5 text-[17px] text-slate-300 font-bold z-20 pointer-events-none">
      {index + 1}
    </span>
    <div className="flex-1 grid grid-cols-8 gap-0 border-t border-slate-300">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[1.5cm] border-r border-b border-slate-300 relative bg-white overflow-hidden first:border-l first:border-slate-300">
          {i === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
              <span className="font-serif text-slate-900 text-3xl leading-none">
                {problem.character}
              </span>
              <div className="absolute bottom-0.5 left-0 right-0 text-center px-0.5">
                <span className="text-[8px] font-black text-blue-900 bg-white/90 px-1 rounded-sm leading-none whitespace-nowrap">
                  {problem.meaning} {problem.reading}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15]">
                <div className="w-full h-[0.5px] border-t border-slate-400"></div>
                <div className="h-full w-[0.5px] border-l border-slate-400 absolute"></div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[0.5px] border-t border-dashed border-slate-100"></div>
                <div className="h-full w-[0.5px] border-l border-dashed border-slate-100 absolute"></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const QuestionItem: React.FC<{ problem: ChineseProblem; index: number; type: ChineseProblemType }> = ({ problem, index, type }) => (
  <div className="flex relative items-center w-full px-4 py-1.5 md:py-2 min-h-[45px] md:min-h-[50px] bg-white">
    <span className="absolute top-1 left-1 text-[8px] text-slate-300 font-bold">{index + 1}</span>
    
    <div className="flex items-center justify-center w-12 md:w-16 shrink-0 border-r border-slate-100 mr-4">
      <span className="text-2xl md:text-3xl font-serif text-slate-900">{problem.character}</span>
    </div>
    
    <div className="flex-1 flex items-center">
      {type === ChineseProblemType.MULTIPLE_CHOICE ? (
        <div className="grid grid-cols-4 gap-x-4 w-full text-[10px] md:text-[12px]">
          {problem.options?.map((opt, i) => (
            <div key={i} className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
              <span className="font-black text-slate-400 shrink-0">({i + 1})</span>
              <span className="font-medium truncate text-slate-700">{opt}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] text-slate-400 shrink-0">(뜻과 음을 쓰세요)</span>
          <div className="flex-1 border-b-2 border-slate-200 h-6"></div>
        </div>
      )}
    </div>
  </div>
);

export const ChineseProblemItem: React.FC<Props> = ({ problem, index, type }) => {
  if (type === ChineseProblemType.WRITING_PRACTICE) {
    return <WritingPracticeItem problem={problem} index={index} />;
  }
  return <QuestionItem problem={problem} index={index} type={type} />;
};
