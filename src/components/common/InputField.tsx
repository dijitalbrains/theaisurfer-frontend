import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable input field component matching the project's theme
 * Supports labels, error states, and helper text
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-3
          bg-slate-900/50 
          border ${error ? "border-red-500" : "border-white/10"}
          rounded-lg
          text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
