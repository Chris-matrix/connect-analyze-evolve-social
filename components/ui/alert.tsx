'use client';

import * as React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-background text-foreground',
      destructive: 'bg-destructive/15 text-destructive border-destructive/50',
    };
    
    const variantStyle = variantStyles[variant] || variantStyles.default;
    
    return (
      <div
        ref={ref}
        role="alert"
        className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variantStyle} ${className || ''}`}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-sm [&_p]:leading-relaxed ${className || ''}`}
        {...props}
      />
    );
  }
);

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
