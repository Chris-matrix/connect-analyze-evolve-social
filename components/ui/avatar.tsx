'use client';

import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`aspect-square h-full w-full ${className || ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ display: hasError ? 'none' : 'block' }}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className || ''}`}
        {...props}
      />
    );
  }
);

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
