import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  // Add/remove event listeners
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  // Focus the modal when it opens
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus()
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none ${className}`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
