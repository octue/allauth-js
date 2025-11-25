import type React from 'react'

export interface InputGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  help?: string
  helperText?: string
  children?: React.ReactNode
}

export const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  (
    { label, error, help, helperText, children, className = '', ...props },
    ref
  ) => {
    const inputClasses = `
      block w-full px-3 py-2 border rounded-md shadow-sm
      focus:outline-none focus:ring-2 focus:ring-allauth-500 focus:border-allauth-500
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${
        error
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
      }
      ${className}
    `.trim()

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {children}
        </div>
        {(help || helperText) && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {help || helperText}
          </p>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

InputGroup.displayName = 'InputGroup'
