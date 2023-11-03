import { useState } from "react"
import Input from "./Input.jsx"

export default function Term() {
    const [termValue, setTermValue] = useState("")
    const [defValue, setDefValue] = useState("")


    return (
        <div className="border-2 p-[20px] w-[600px] my-[20px] rounded-lg">
            <form>
                <Input 
                defaultValue={"Term"}
                value={termValue} 
                onChange={(e) => setTermValue(e.target.value)} 
                />
                <br />
                <Input 
                defaultValue={"Definition"}
                value={defValue} 
                onChange = {(e) => setDefValue(e.target.value)} 
                />
            </form>
        </div>
    )
}