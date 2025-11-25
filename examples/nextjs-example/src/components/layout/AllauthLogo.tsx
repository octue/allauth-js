import type React from 'react'

export interface AllauthLogoProps {
  className?: string
}

export const AllauthLogo: React.FC<AllauthLogoProps> = ({ className }) => (
  <svg
    viewBox="0 0 95 30"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="allauth-js logo"
  >
    {/* Text: allauth */}
    <text
      x="0"
      y="21"
      className="fill-gray-900 dark:fill-white"
      fontFamily="ui-monospace, monospace"
      fontSize="16"
      fontWeight="600"
    >
      allauth
    </text>
    {/* JS badge */}
    <rect
      x="72"
      y="5"
      width="22"
      height="22"
      rx="3"
      className="fill-yellow-400"
    />
    <text
      x="76"
      y="21"
      className="fill-gray-900"
      fontFamily="ui-monospace, monospace"
      fontSize="12"
      fontWeight="700"
    >
      JS
    </text>
  </svg>
)
