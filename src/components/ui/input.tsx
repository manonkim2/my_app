import * as React from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ReactNode
  errors?: string[]
  button?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, button, errors, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col">
        <div className="relative">
          {icon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              icon ? 'pl-10' : '',
              className,
            )}
            ref={ref}
            {...props}
          />
          {button && (
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 transition-opacity disabled:opacity-50"
            >
              {button}
            </button>
          )}
        </div>
        {errors?.map((error, index) => (
          <span key={index} className="text-red-500 text-xs">
            {error}
          </span>
        ))}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
