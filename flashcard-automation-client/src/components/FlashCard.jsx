import { useState } from "react";
import { CSSTransition } from "react-transition-group";

// eslint-disable-next-line react/prop-types
export default function Flashcard({ definition, term }) {
    const [showFront, setShowFront] = useState(true);

    const handleArrowClicks = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }

    return (
        <>
            <div className="w-[500px] h-[325px] text-center mx-4 hover:cursor-pointer flip-card card-container"
            onKeyDown={(e) => handleArrowClicks(e)}
            >
                <CSSTransition
                    in={showFront}
                    timeout={300}
                    classNames='flip'
                >
                    <div className="w-full border-2 h-full rounded-lg relative card" onClick={() => {
                        setShowFront((v) => !v);
                    }}>
                        <div id="card-front" className="p-10 h-full w-full flex justify-center align-center absolute card-front"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
</svg>

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