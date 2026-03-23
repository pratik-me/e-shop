import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  options?: (string | SelectOption)[];
  value?: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  className?: string;
}

export default function Select({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select...", 
  error,
  className,
}: any) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getDisplayValue = (): string => {
    if (value === undefined || value === null) return placeholder;
    
    const selectedOption = options.find((opt: any) => {
      if (typeof opt === 'object' && opt !== null) {
        return opt.value === value;
      }
      return opt === value;
    });
    
    if (!selectedOption) return placeholder;
    
    return typeof selectedOption === 'object' ? selectedOption.label : String(selectedOption);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer flex justify-between items-center select-none ${
          isOpen 
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-white" 
            : error 
              ? "border-red-500 bg-red-50" 
              : "border-gray-300 bg-white hover:border-gray-400"
        } ${className}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {getDisplayValue()}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1.5 flex flex-col gap-1 max-h-60 overflow-y-auto">
          {options.map((option: any, index: any) => {
            const isObject = typeof option === 'object' && option !== null;
            const optValue = isObject ? option.value : option;
            const optLabel = isObject ? option.label : String(option);
            const isSelected = value === optValue;

            return (
              <div
                key={index}
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${
                  isSelected 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}