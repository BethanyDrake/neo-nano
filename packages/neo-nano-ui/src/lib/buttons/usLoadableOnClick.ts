import { useCallback, useState } from 'react'

export const useLoadableOnClick = (onClick: () => Promise<unknown>) => {
  const [isLoading, setIsLoading] = useState(false)

  const _onClick = useCallback(() => {
    setIsLoading(true)
    onClick().finally(() => setIsLoading(false))
  }, [onClick])

  return { isLoading, onClick: _onClick }
}

export const useFormSubmission = <Inputs>(onSumbit: (formData: Inputs) => Promise<unknown>) => {
  const [isLoading, setIsLoading] = useState(false)

  const _onSubmit = useCallback(
    (formData: Inputs) => {
      setIsLoading(true)
      onSumbit(formData).finally(() => {
        setIsLoading(false)
      })
    },
    [onSumbit],
  )

  return { isLoading, onSubmit: _onSubmit }
}
