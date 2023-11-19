import { useState } from "react"

// eslint-disable-next-line react/prop-types
export default function FlashCard({ definition, term }) {
    const [side, setSide] = useState(true)

    const handleClick = () => {
        setSide(!side)
    }

    return (
        <>
            <div className="w-[500px] h-[325px] border-2 text-center rounded-lg">
                { side ?
                    <div className="p-10" onClick={handleClick}> 
                        {definition}
                    </div>
                    :
                    <div className="p-10" onClick={handleClick}>
                        {term}
                    </div>
                }
 
            </div>
        </>

    )
}