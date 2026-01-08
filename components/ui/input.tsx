import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'flex h-10 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-black',
                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
