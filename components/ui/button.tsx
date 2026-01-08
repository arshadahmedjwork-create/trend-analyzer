import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-black',
                    {
                        'bg-white text-black hover:bg-gray-200': variant === 'primary',
                        'bg-zinc-800 text-white hover:bg-zinc-700': variant === 'secondary',
                        'border border-zinc-700 hover:bg-zinc-800 text-white': variant === 'outline',
                        'hover:bg-zinc-800 text-white': variant === 'ghost',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-10 px-6 py-2': size === 'md',
                        'h-12 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
