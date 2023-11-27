import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Star from "../icons/star";
import { useContext } from "react";
import { Context } from "../Context";

// eslint-disable-next-line react/prop-types
export default function Flashcard({ definition, term, index }) {
    const { 
        setSaved, 
        saved } = useContext(Context);
    const [showFront, setShowFront] = useState(true);

    const handleArrowClicks = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }

    const save = () => {
        setSaved([...saved, index])
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
                        <div className="justify-left p-5">
                            <Star onClick={save} saved />
                        </div>
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