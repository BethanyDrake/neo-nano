import { useCallback, useState } from "react"

export const useLoadableOnClick = (onClick: () => Promise<unknown>) => {

    const [isLoading, setIsLoading] = useState(false)
    
    const _onClick = useCallback(() => {
        setIsLoading(true)
        onClick().finally(() => setIsLoading(false))
    }, [onClick])

    return {isLoading, onClick: _onClick}
}