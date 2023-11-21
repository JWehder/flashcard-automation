import { useState } from "react";
import { CSSTransition } from "react-transition-group";

// eslint-disable-next-line react/prop-types
export default function Flashcard({ definition, term }) {
    const [side, setSide] = useState(true)

    const handleClick = () => {
        setSide(!side)
    }

    const handleArrowClicks = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }

    return (
        <>
            <div className="w-[500px] h-[325px] border-2 text-center rounded-lg mx-4 hover:cursor-pointer flip-card card-container"
            onClick={handleClick}
            onKeyDown={(e) => handleArrowClicks(e)}
            >
                <CSSTransition>
                    <div className="w-full h-full rounded-full relative card">
                        <div id="card-front" className="p-10 h-full w-full flex justify-center align-center absolute card-front"> 
                            {definition}
                        </div>
                        <div id="card-back" className="p-10 h-full w-full flex justify-center align-center absolute card-back">
                            {term}
                        </div>
                    </div>
                </CSSTransition>
            </div>
        </>

    )
}