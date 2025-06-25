import { memo } from "react"

const Button=({type,className,onFunc,btnText,...rest})=>{
return (
    <button type={type} className={className} onClick={onFunc} {...rest}>{btnText}</button>
)
}

export default memo(Button)