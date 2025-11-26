import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children?: ReactNode
}

// Mock Next.js Link component for Storybook
const Link = ({ children, href, ...props }: LinkProps) => {
  return (
    <a {...props} href={href}>
      {children}
    </a>
  )
}

export default Link
