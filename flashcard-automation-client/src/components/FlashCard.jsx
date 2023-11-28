import { useContext, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Star from "../icons/star";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Context, endpoint } from "../Context";

// eslint-disable-next-line react/prop-types
export default function Flashcard({ saved, id, definition, term }) {
    const { 
        currentSetPointer, 
        sets } = useContext(Context)

    const queryClient = useQueryClient();

    const [showFront, setShowFront] = useState(true);
    
    const savedMutation = useMutation({
        mutationFn: (id) => axios.patch(`${endpoint}/saved_flashcards/${id}`),
        onSuccess: () => {
            queryClient.setQueryData(['sets'], oldSets => {
                return oldSets.map(set => {
                    if (set.id === sets[currentSetPointer].id) {
                        // Update the specific flashcard in the set
                        const updatedFlashcards = set.flashcards.map(card => 
                            card.id === id ? { ...card, saved: !card.saved } : card
                        );
                        return { ...set, flashcards: updatedFlashcards };
                    }
                    return set; 
                });
            });
        },
        onError: (resp) => {
            const error = resp.response.data
            console.log(error)
        }
    })

    const handleArrowClicks = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }

    const save = (e) => {
        e.stopPropagation();
        savedMutation.mutate(id);
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
                        <div className="justify-left p-5" onClick={(e) => save(e)}>
                            <Star saved={saved} />
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