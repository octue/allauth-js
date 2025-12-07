import type { FC, ReactNode, SyntheticEvent } from 'react'
import { useCallback } from 'react'

import type { UrlObject } from 'node:url'
import clsx from 'clsx'
import Ripple from 'material-ripple-effects'

export interface ButtonProps {
  palette?: 'allauth' | 'red' | 'error' | 'amber' | 'gray' | 'green'
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  type?: 'submit' | 'button'
  onClick?: (e: SyntheticEvent) => void
  onMouseDown?: (e: SyntheticEvent) => void
  href?: UrlObject | string
  title?: string
  plain?: boolean
  outlined?: boolean
  className?: string
  children: ReactNode
}

export const sizeClasses = {
  xs: 'text-xs px-3 py-0.5 gap-2 leading-4',
  sm: 'text-xs px-4 py-1 gap-2 leading-4',
  md: 'text-sm px-5 py-1.5 gap-2 leading-5',
  lg: 'text-sm px-6 py-2 gap-2 leading-6',
}

export const colorPalette = {
  allauth: {
    default:
      'text-white bg-allauth-600 hover:bg-allauth-500 focus:bg-allauth-500 disabled:text-gray-500 disabled:bg-gray-200/25 dark:text-white dark:bg-allauth-500 dark:hover:bg-allauth-400 dark:focus:bg-allauth-500 dark:disabled:bg-gray-600/25 dark:disabled:text-gray-500',
    plain:
      'text-allauth-600 hover:text-allauth-800 hover:bg-allauth-200/25 disabled:hover:bg-transparent focus:text-allauth-800 disabled:text-gray-500 dark:text-allauth-300 dark:hover:text-allauth-300 dark:focus:text-allauth-300 dark:hover:bg-allauth-200/25 dark:disabled:text-gray-500',
    outlined:
      'text-allauth-600 border border-allauth-600 hover:text-allauth-800 hover:bg-allauth-200/25 focus:text-allauth-800 focus:bg-allauth-200/25 disabled:text-gray-500 disabled:border-gray-300 dark:text-allauth-300 dark:border-allauth-300 dark:hover:text-allauth-300 dark:focus:text-allauth-300 dark:hover:bg-allauth-200/25 dark:focus:bg-allauth-200/25 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
  },
  red: {
    default:
      'text-white bg-red-700 hover:bg-red-500 focus:bg-red-500 disabled:text-gray-500 disabled:bg-gray-200/25 dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:focus:bg-red-500 dark:disabled:bg-gray-600/25 dark:disabled:text-gray-500',
    plain:
      'text-red-700 hover:text-red-800 hover:bg-red-200/25 disabled:hover:bg-transparent focus:text-red-800 disabled:text-gray-500 dark:text-red-300 dark:hover:text-red-300 dark:focus:text-red-300 dark:hover:bg-red-200/25 dark:disabled:text-gray-500',
    outlined:
      'text-red-700 border border-red-700 hover:text-red-800 hover:bg-red-200/25 focus:text-red-800 focus:bg-red-200/25 disabled:text-gray-500 disabled:border-gray-300 dark:text-red-300 dark:border-red-300 dark:hover:text-red-300 dark:focus:text-red-300 dark:hover:bg-red-200/25 dark:focus:bg-red-200/25 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
  },
  error: {
    default:
      'text-white bg-red-500 hover:bg-red-600 focus:bg-red-500 disabled:text-gray-500 disabled:bg-gray-200/25 dark:text-white dark:bg-red-500 dark:hover:bg-red-400 dark:focus:bg-red-500 dark:disabled:bg-gray-600/25 dark:disabled:text-gray-500',
    plain:
      'text-red-500 hover:text-red-600 hover:bg-red-200/25 disabled:hover:bg-transparent focus:text-red-800 disabled:text-gray-500 dark:text-red-300 dark:hover:text-red-300 dark:focus:text-red-300 dark:hover:bg-red-200/25 dark:disabled:text-gray-500',
    outlined:
      'text-red-500 border border-red-500 hover:text-red-600 hover:bg-red-200/25 focus:text-red-800 focus:bg-red-200/25 disabled:text-gray-500 disabled:border-gray-300 dark:text-red-300 dark:border-red-300 dark:hover:text-red-300 dark:focus:text-red-300 dark:hover:bg-red-200/25 dark:focus:bg-red-200/25 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
  },
  amber: {
    default:
      'text-white bg-amber-600 hover:bg-amber-500 focus:bg-amber-500 disabled:text-gray-500 disabled:bg-gray-200/25 dark:text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:focus:bg-amber-500 dark:disabled:bg-gray-600/25 dark:disabled:text-gray-500',
    plain:
      'text-amber-600 hover:text-amber-800 hover:bg-amber-200/25 disabled:hover:bg-transparent focus:text-amber-800 disabled:text-gray-500 dark:text-amber-300 dark:hover:text-amber-300 dark:focus:text-amber-300 dark:hover:bg-amber-200/25 dark:disabled:text-gray-500',
    outlined:
      'text-amber-600 border border-amber-600 hover:text-amber-800 hover:bg-amber-200/25 focus:text-amber-800 focus:bg-amber-200/25 disabled:text-gray-500 disabled:border-gray-300 dark:text-amber-300 dark:border-amber-300 dark:hover:text-amber-300 dark:focus:text-amber-300 dark:hover:bg-amber-200/25 dark:focus:bg-amber-200/25 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
  },
  gray: {
    default:
      'text-white bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 disabled:text-gray-500 disabled:bg-gray-200/25 dark:text-white dark:bg-gray-500 dark:hover:bg-gray-400 dark:focus:bg-gray-500 dark:disabled:bg-gray-600/25 dark:disabled:text-gray-500',
    plain:
      'text-gray-600 hover:text-gray-800 hover:bg-gray-200/25 disabled:hover:bg-transparent focus:text-gray-800 disabled:text-gray-500 dark:text-gray-300 dark:hover:text-gray-300 dark:focus:text-gray-300 dark:hover:bg-gray-200/25 dark:disabled:text-gray-500',
    outlined:
      'text-gray-600 border border-gray-600 hover:text-gray-800 hover:bg-gray-200/25 focus:text-gray-800 focus:bg-gray-200/25 disabled:text-gray-500 disabled:border-gray-300 dark:text-gray-300 dark:border-gray-300 dark:hover:text-gray-300 dark:focus:text-gray-300 dark:hover:bg-gray-200/25 dark:focus:bg-gray-200/25 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
  },
  green: {
    default:
      'text-white bg-green-600 hover:bg-green-500 focus:bg-green-500 disabled:text-gray-500 disabled:bg-gray-200/25 dark:text-white dark:bg-green-500 dark:hover:bg-green-400 dark:focus:bg-green-500 dark:disabled:bg-gray-600/25 dark:disabled:text-gray-500',
    plain:
      'text-green-600 hover:text-green-800 hover:bg-green-200/25 disabled:hover:bg-transparent focus:text-green-800 disabled:text-gray-500 dark:text-green-300 dark:hover:text-green-300 dark:focus:text-green-300 dark:hover:bg-green-200/25 dark:disabled:text-gray-500',
    outlined:
      'text-green-600 border border-green-600 hover:text-green-800 hover:bg-green-200/25 focus:text-green-800 focus:bg-green-200/25 disabled:text-gray-500 disabled:border-gray-300 dark:text-green-300 dark:border-green-300 dark:hover:text-green-300 dark:focus:text-green-300 dark:hover:bg-green-200/25 dark:focus:bg-green-200/25 dark:disabled:text-gray-500 dark:disabled:border-gray-600',
  },
}

export const Button: FC<ButtonProps> = ({
  size = 'md',
  palette = 'allauth',
  disabled,
  type = 'button',
  plain = false,
  outlined = false,
  onMouseDown,
  className,
  children,
  href,
  title,
  ...rest
}) => {
  const sizeClass = sizeClasses[size]
  const colorClasses = outlined
    ? colorPalette[palette].outlined
    : plain
      ? colorPalette[palette].plain
      : colorPalette[palette].default

  const rippleEffect = new Ripple()

  const handleMouseDown = useCallback(
    (e: SyntheticEvent) => {
      rippleEffect.create(e, 'light')
      return typeof onMouseDown === 'function' && onMouseDown(e)
    },
    [onMouseDown, rippleEffect]
  )
  const Component = href ? 'a' : 'button'
  const componentProps = href ? { href, title, ...rest } : { type, ...rest }

  return (
    //@ts-ignore
    <Component
      className={clsx(
        'flex items-center justify-center rounded-md font-medium focus:outline-none',
        sizeClass,
        colorClasses,
        className
      )}
      onMouseDown={handleMouseDown}
      disabled={disabled}
      {...componentProps}
    >
      {children}
    </Component>
  )
}
