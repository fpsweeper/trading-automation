'use client';
import React, { useState, useRef, useEffect } from 'react';

interface TwoStepProps {
  code: string; // single string state
  setCode: React.Dispatch<React.SetStateAction<string>>;
  length?: number;
  disabled?: boolean;
}

export default function TwoStep({
  code,
  setCode,
  length = 5,
  disabled = false,
}: TwoStepProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into array for rendering
  const codeArray = code.padEnd(length, '').split('').slice(0, length);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (disabled) return;
    if (isNaN(Number(element.value)) || element.value === ' ') {
      element.value = '';
      return;
    }

    const newCodeArray = [...codeArray];
    newCodeArray[index] = element.value;

    // Join array into single string
    setCode(newCodeArray.join(''));

    // Move focus to next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;
    if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    setCode(pasteData.padEnd(length, ''));
    const lastFullInput = Math.min(pasteData.length - 1, length - 1);
    inputRefs.current[lastFullInput]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {codeArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="tel"
          maxLength={1}
          value={digit}
          placeholder="•"
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => {
            e.target.select();
            setFocusedIndex(index);
          }}
          onBlur={() => setFocusedIndex(-1)}
          disabled={disabled}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-input dark:bg-[#0D1117] text-foreground dark:text-white rounded-lg outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600
            ${focusedIndex === index
              ? 'border-2 border-blue-500'
              : 'border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
        />
      ))}
    </div>
  );
}


