import React from "react";

export const DotButton = ({ selected, onClick }: any) => (
  <button
    className={`relative flex h-[3px] w-full cursor-pointer items-center rounded-sm border-0 p-0  outline-0 ${
      selected
        ? "opacity-100; bg-slate-400 dark:bg-gray-400"
        : "bg-slate-200 dark:bg-gray-700"
    }`}
    type="button"
    onClick={onClick}
  />
);

export const PrevButton = ({ enabled, onClick }: any) => (
  <button
    className="fixed bottom-0 left-0 z-[1] h-40 rotate-180 transform cursor-pointer rounded-l-xl bg-slate-300 bg-opacity-20 hover:bg-opacity-20  disabled:cursor-default  disabled:opacity-60  dark:bg-gray-700 dark:bg-opacity-50 lg:left-0 lg:top-1/2 lg:h-[50vh] lg:-translate-y-1/2"
    onClick={onClick}
    disabled={!enabled}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-slate-800 dark:text-gray-300 lg:h-12 lg:w-12"
      width="93"
      height="93"
      viewBox="0 0 93 93"
      fill="none"
    >
      <path
        d="M31.9688 17.4375L61.0312 46.5L31.9688 75.5625"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export const NextButton = ({ enabled, onClick }: any) => (
  <button
    className="fixed bottom-0 right-0 z-[1] h-40 transform cursor-pointer rounded-l-xl bg-slate-400 bg-opacity-20 hover:bg-opacity-20 disabled:cursor-default  disabled:opacity-60  dark:bg-gray-700  dark:bg-opacity-50 lg:right-0 lg:top-1/2 lg:h-[50vh] lg:-translate-y-1/2"
    onClick={onClick}
    disabled={!enabled}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-slate-800 dark:text-gray-300 lg:h-12 lg:w-12"
      width="93"
      height="93"
      viewBox="0 0 93 93"
      fill="none"
    >
      <path
        d="M31.9688 17.4375L61.0312 46.5L31.9688 75.5625"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);
