'use client';

import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

const DropdownMenuTrigger = React.forwardRef<HTMLDivElement, DropdownMenuTriggerProps>(
  ({ asChild = false, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    
    // Pass the open state to the parent DropdownMenu
    React.useEffect(() => {
      const parent = ref?.current?.parentElement;
      if (parent) {
        (parent as any).__open = open;
      }
    }, [open, ref]);
    
    return (
      <div 
        ref={ref} 
        onClick={() => setOpen(!open)} 
        className="inline-flex cursor-pointer"
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps {
  align?: 'start' | 'end' | 'center';
  children: React.ReactNode;
}

const DropdownMenuContent = ({ align = 'center', children }: DropdownMenuContentProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };
  
  return (
    <div 
      className={`absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignClasses[align]}`}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return <div className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{children}</div>;
    }
    
    return (
      <button
        ref={ref}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = () => {
  return <div className="border-t border-gray-100 my-1"></div>;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
