import type { FC } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, useSetErrors } from '@octue/allauth-js/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { InputGroup } from '@/components/forms/fields/InputGroup'

const schema = z.object({
  email: z.email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export interface AddEmailFormProps {
  onClose: () => void
  add: (email: string) => Promise<unknown>
}

export const AddEmailForm: FC<AddEmailFormProps> = ({ onClose, add }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const setErrors = useSetErrors<FormData>(setError)

  const handleCancel = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    try {
      const result = await add(data.email)
      // Check if result has errors (API error response)
      if (result && typeof result === 'object' && 'errors' in result) {
        setErrors(
          result as { errors?: Array<{ param?: string; message: string }> }
        )
        return
      }
      // Success - close modal and reset form
      reset()
      onClose()
    } catch (e) {
      console.error(e)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors?.root?.nonFieldError?.message && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.root.nonFieldError.message}
          </p>
        </div>
      )}
      <InputGroup
        label="Email address"
        id="add-email"
        type="email"
        placeholder="you@example.com"
        error={errors?.email?.message}
        disabled={isSubmitting}
        autoComplete="email"
        autoFocus
        {...register('email')}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          palette="gray"
          plain
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add email'}
        </Button>
      </div>
    </form>
  )
}
