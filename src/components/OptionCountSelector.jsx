import React, { useState, useEffect } from 'react';

/**
 * Reusable component for selecting option counts with automatic recommendations
 * 
 * @param {Object} props
 * @param {number} props.value - Current selected option count
 * @param {Function} props.onChange - Callback when option count changes
 * @param {number} props.recommendedValue - Recommended option count
 * @param {string} props.label - Label for the option selector (default: "Number of options:")
 * @param {Array} props.options - Available options (default: [3, 6, 9])
 * @param {string} props.emoji - Emoji to display in the label (default: "🔢")
 */
const OptionCountSelector = ({ 
  value, 
  onChange, 
  recommendedValue,
  label = "Number of options:",
  options = [3, 6, 9],
  emoji = "🔢"
}) => {
  return (
    <div className="mt-4">
      <p className="text-lg font-medium mb-2">
        {label} {emoji}
        <span className="text-sm text-gray-500 font-normal ml-2">
          (Recommended: {recommendedValue})
        </span>
      </p>
      <div className="flex gap-3">
        {options.map(num => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
              value === num 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Custom hook to manage option count with automatic recommendations
 * 
 * @param {number} initialValue - Initial option count
 * @param {Function} getRecommendedFn - Function that returns recommended count based on input value
 * @param {any} inputValue - Value used to calculate recommendations
 * @returns {Array} [optionCount, setOptionCount, recommendedCount, resetManualSelection]
 */
export const useOptionCount = (initialValue, getRecommendedFn, inputValue) => {
  const [optionCount, setOptionCount] = useState(initialValue);
  const [recommendedCount, setRecommendedCount] = useState(initialValue);
  const [manuallySelected, setManuallySelected] = useState(false);
  
  // Update recommendation and optionally the actual count
  useEffect(() => {
    if (inputValue !== undefined && getRecommendedFn) {
      const recommended = getRecommendedFn(inputValue);
      setRecommendedCount(recommended);
      
      if (!manuallySelected) {
        setOptionCount(recommended);
      }
    }
  }, [inputValue, getRecommendedFn, manuallySelected]);
  
  // Custom setter that tracks manual selection
  const setOptionCountWithFlag = (value) => {
    setOptionCount(value);
    setManuallySelected(true);
  };
  
  // Reset manual selection flag
  const resetManualSelection = () => {
    setManuallySelected(false);
  };
  
  return [optionCount, setOptionCountWithFlag, recommendedCount, resetManualSelection];
};

export default OptionCountSelector;