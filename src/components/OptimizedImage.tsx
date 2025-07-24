import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback = '/placeholder.svg',
  ...props
}: OptimizedImageProps) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src={src || fallback}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          if (fallback && src !== fallback) {
            (e.target as HTMLImageElement).src = fallback;
          }
        }}
        {...props}
      />
    </div>
  );
}
