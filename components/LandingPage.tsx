import React from 'react';
import { Subject } from '../types';

interface LandingPageProps {
  onSelectSubject: (subject: Subject) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectSubject }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">AI Smart Worksheet</h1>
        <p className="text-slate-600 text-lg">초등학생을 위한 맞춤형 학습지 생성기</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        <button onClick={() => onSelectSubject(Subject.MATH)} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all text-left flex flex-col h-full">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">수학 (Math)</h2>
          <p className="text-sm text-slate-500 mb-4 flex-grow">덧셈, 뺄셈, 곱셈 연산 능력을 키워주는 문제지</p>
          <span className="text-blue-600 text-sm font-bold">시작하기 →</span>
        </button>
        <button onClick={() => onSelectSubject(Subject.CHINESE)} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-500 transition-all text-left flex flex-col h-full">
          <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">한문 (Chinese)</h2>
          <p className="text-sm text-slate-500 mb-4 flex-grow">급수 한자 암기와 쓰기 연습</p>
          <span className="text-amber-600 text-sm font-bold">시작하기 →</span>
        </button>
        <button onClick={() => onSelectSubject(Subject.ENGLISH)} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-500 transition-all text-left flex flex-col h-full">
          <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">영어 (English)</h2>
          <p className="text-sm text-slate-500 mb-4 flex-grow">기초 영단어와 짧은 문장 연습</p>
          <span className="text-emerald-600 text-sm font-bold">시작하기 →</span>
        </button>
      </div>
    </div>
  );
};
