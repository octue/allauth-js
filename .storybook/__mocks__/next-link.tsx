import React from 'react'

// Mock Next.js Link component for Storybook
const Link = ({ children, href, ...props }: any) => {
  return <a {...props} href={href}>{children}</a>
}

export default Link
