import React, { useState } from 'react';
import OptionCountSelector, { useOptionCount } from './OptionCountSelector';

/**
 * Reusable component for game setup screens
 * 
 * @param {Object} props
 * @param {string} props.title - Game title
 * @param {Function} props.onStart - Function to call when game starts
 * @param {Array} props.fields - Configuration fields to show
 * @param {Object} props.initialValues - Initial values for fields
 */
const GameSetup = ({ 
  title, 
  onStart, 
  fields = [],
  initialValues = {},
  logoEmoji = "🎮"
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  // Helper functions for option counts
  const getRecommendedOptionCount = (max) => {
    if (!max) return 3;
    if (max <= 10) return 3;
    if (max <= 15) return 6;
    return 9;
  };
  
  // Use custom hook for option counts if needed
  const [optionCount, setOptionCount, recommendedCount] = useOptionCount(
    initialValues.optionCount || 3,
    getRecommendedOptionCount,
    parseInt(values.maxNumber || initialValues.maxNumber || 10)
  );
  
  // Update values when option count changes
  if (values.optionCount !== optionCount) {
    setValues(prev => ({ ...prev, optionCount }));
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: inputValue
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleRadioChange = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  };
  
  const validateFields = () => {
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
      
      if (field.type === 'number' && values[field.name]) {
        const numValue = parseFloat(values[field.name]);
        if (isNaN(numValue)) {
          newErrors[field.name] = `${field.label} must be a number`;
          isValid = false;
        } else if (field.min !== undefined && numValue < field.min) {
          newErrors[field.name] = `${field.label} must be at least ${field.min}`;
          isValid = false;
        } else if (field.max !== undefined && numValue > field.max) {
          newErrors[field.name] = `${field.label} must be no more than ${field.max}`;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleStart = () => {
    if (validateFields()) {
      onStart(values);
    }
  };
  
  const renderField = (field) => {
    const { type, name, label, options, min, max, placeholder, hint, emoji } = field;
    
    switch (type) {
      case 'number':
        return (
          <div key={name} className="mb-4">
            <label className="text-lg font-medium">
              {label} {emoji}
              <input
                type="number"
                name={name}
                min={min}
                max={max}
                value={values[name] || ''}
                onChange={handleInputChange}
                className={`w-full p-2 mt-2 border-2 ${errors[name] ? 'border-red-500' : 'border-blue-300'} rounded-lg text-xl text-gray-700 bg-white`}
                placeholder={placeholder}
              />
            </label>
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
            {hint && (
              <p className="text-sm text-gray-600 mt-1">{hint}</p>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div key={name} className="mb-4">
            <p className="text-lg font-medium mb-2">{label} {emoji}</p>
            <div className="flex flex-col gap-2">
              {options.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={values[name] === option.value}
                    onChange={() => handleRadioChange(name, option.value)}
                    className="mr-2"
                  />
                  <span className="text-lg">{option.icon} {option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'optionCount':
        return (
          <div key={name} className="mb-4">
            <OptionCountSelector
              value={optionCount}
              onChange={setOptionCount}
              recommendedValue={recommendedCount}
              label={label}
              emoji={emoji}
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        {logoEmoji} {title}
      </h1>
      
      <div className="flex flex-col gap-2">
        {fields.map(renderField)}
        
        <button
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors mt-4"
        >
          Start Game 🚀
        </button>
      </div>
    </div>
  );
};

export default GameSetup;