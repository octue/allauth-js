import { useCallback } from 'react'

// TODO REFACTOR REQUEST Pull these types out of RHF and lose the dependency
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormSetError,
} from 'react-hook-form'

export interface ErrorResponse {
  errors?: Array<{ param?: string; message: string }>
}

/* Extra sugar to help set errors on React Hook Form `useForm` from allauth callback responses
 */
export const useSetErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>
) => {
  // Set any field and non-field errors from the API onto the form. Non field errors go into `root.nonFieldError`.
  const setErrors = useCallback(
    (response: ErrorResponse) => {
      if (response?.errors) {
        for (const error of response.errors) {
          const key = (error.param as Path<T>) || 'root.nonFieldError'
          setError(key, {
            type: 'manual',
            message: error.message as string,
          } as FieldError)
        }
      }
      return response
    },
    [setError]
  )

  // TODO Consider clearing non-field errors on form becoming dirty

  // Clear non-field errors when form becomes dirty
  // useEffect(() => {
  //   if (isDirty) {
  //     clearErrors('root.nonFieldError')
  //   }
  // }, [setNonFieldErrors, isDirty])

  return setErrors
}
