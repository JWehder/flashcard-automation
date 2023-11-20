import { useState } from "react"

// eslint-disable-next-line react/prop-types
export default function Flashcard({ definition, term }) {
    const [side, setSide] = useState(true)

    const handleClick = () => {
        setSide(!side)
    }

    return (
        <>
            <div className="w-[500px] h-[325px] border-2 text-center rounded-lg mx-4 hover:cursor-pointer"
            onClick={handleClick}>
                { side ?
                    <div className="p-10"> 
                        {definition}
                    </div>
                    :
                    <div className="p-10">
                        {term}
                    </div>
                }
 
            </div>
        </>

    )
}