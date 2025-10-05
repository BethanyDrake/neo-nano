import { useCallback, useState } from "react"
import { Visibility } from "../forum.types"
import { SmallIconButton } from "./ExtendableIconButton"

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
export const UpdateVisibilityButton = ({visibility, onClick}: {visibility: Visibility, onClick: (newVisibility: Visibility) => Promise<void>} ) => {
 const [isLoading, setIsLoading] = useState(false) 

 const _onClick = useCallback(() => {
    setIsLoading(true)
    const newVisibility = visibility === 'private' ? 'public' : 'private'
    onClick(newVisibility).then(() => setIsLoading(false))
 }, [visibility, onClick])


 const text = visibility === 'private' ? 'make public' : 'make private'

  const icon = visibility === 'private' ? faEyeSlash : faEye;
 return <SmallIconButton  isLoading={isLoading} onClick={_onClick} icon={icon} text={text}/>
}