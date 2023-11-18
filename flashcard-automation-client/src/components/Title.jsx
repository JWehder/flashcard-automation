import { useState, useContext } from "react"
import { Context } from "../Context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

// eslint-disable-next-line react/prop-types
export default function Title() {
    const { currentSet } = useContext(Context);

    const [readOnly, setReadOnly] = useState(true);
    const [currentName, setCurrentName] = useState(currentSet.name);

    const queryClient = useQueryClient();

    const handleFocus = () => {
        setReadOnly(false)
    }

    const handleBlur = () => {
        setReadOnly(true)
        setCurrentName(currentSet.name)
    }

    const handleClick = () => {
        updateMutation.mutate({name: currentName})
    }

    const updateMutation = useMutation({
        mutationFn: (data) => axios.patch(serverRoute, 
            JSON.stringify(data), 
            {
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        onSuccess: (resp) => {
            queryClient.setQueryData(['sets'], oldSets => {
                return oldSets.map(set => {
                const data = resp.data
                if (set.id === currentSet.id) {
                    const filteredFlashcards = set.flashcards.filter((card) => card.id !== data.id);
                    return {
                        ...set, 
                        flashcards: [...filteredFlashcards, data]
                        .sort((a,b) => a.id - b.id)
                    }
                }
                return set
                })
            })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    return (
        <div className="flex my-2 justify-center">
            <input 
            value={currentName} 
            readOnly={readOnly} 
            className="text-2xl border-b-2 border-blue-500 hover:border-blue-700 text-center outline-none" 
            onChange={(e) => setCurrentName(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            />
            { readOnly ?
            ""
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" name="checkmark" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-green-500 hover:stroke-green-700 cursor-pointer my-0" onClick={handleClick}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg> 
            }
        </div>
    )
}