import React from "react";

export const DotButton = ({ selected, onClick }: any) => (
  <button
    className={`cursor-pointer relative w-full h-[3px] flex items-center p-0 border-0 outline-0 bg-slate-200 dark:bg-gray-700  rounded-sm; ${selected ? "bg-slate-400 dark:bg-gray-400 opacity-100;" : ""}`}
    type="button"
    onClick={onClick}
  />
);

export const PrevButton = ({ enabled, onClick }: any) => (
    <button
      className="cursor-pointer bg-transparent fixed z-[1]  top-1/2  transform  -translate-y-1/2 left-[27px] rotate-180 disabled:opacity-20 disabled:cursor-default"
      onClick={onClick}
      disabled={!enabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 lg:w-20 lg:h-20"
        width="93"
        height="93"
        viewBox="0 0 93 93"
        fill="none"
      >
        <path
          d="M31.9688 17.4375L61.0312 46.5L31.9688 75.5625"
          stroke="#64748B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
  

export const NextButton = ({ enabled, onClick }: any) => (
  <button
    className="cursor-pointer bg-transparent fixed z-[1]  top-1/2  transform  -translate-y-1/2
    right-[27px] disabled:opacity-20 disabled:cursor-default"
    onClick={onClick}
    disabled={!enabled}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 lg:w-20 lg:h-20"
      width="93"
      height="93"
      viewBox="0 0 93 93"
      fill="none"
    >
      <path
        d="M31.9688 17.4375L61.0312 46.5L31.9688 75.5625"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);
