'use client';

import * as React from "react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="inline-flex items-center">
        <label className="relative inline-block h-6 w-11">
          <input
            type="checkbox"
            className="peer h-0 w-0 opacity-0"
            ref={ref}
            {...props}
          />
          <span className={`absolute inset-0 cursor-pointer rounded-full bg-gray-300 transition-colors duration-200 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform before:duration-200 before:content-[''] peer-checked:bg-blue-600 peer-checked:before:translate-x-5 peer-focus:ring-2 peer-focus:ring-blue-300 ${className || ''}`} />
        </label>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
