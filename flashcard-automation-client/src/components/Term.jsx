import { useState } from "react"
import Input from "./Input.jsx"
import { useContext } from "react"
import { Context } from "../Context.jsx"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

// eslint-disable-next-line react/prop-types
export default function Term({ term, definition, id }) {
    const { endpoint, currentSet } = useContext(Context)

    const queryClient =  useQueryClient();

    const updateMutation = useMutation({
        mutationFn: id => axios.patch(`${endpoint}/flashcards/${id}`, )
    })

    const deleteMutation = useMutation({
        mutationFn: id => axios.delete(`${endpoint}/flashcards/${id}`),
        onSuccess: () => {
        // Assuming 'variables' is the id of the deleted term
        queryClient.setQueryData(['sets'], oldSets => {
            return oldSets.map(set => {
            if (set.id === currentSet.id) { 
                return {
                ...set,
                flashcards: set.flashcards.filter(fcard => fcard.id !== id)
                };
            }
            return set;
            });
        });
        },
        // Optionally, handle errors
        onError: (error) => {
        console.error("Error deleting term:", error);
        }
});

    const [readOnly, setReadOnly] = useState(true)

    return (
            <div className="p-[12px] justify-center items-center m-0 flex">
                <div className="border-2 p-[15px] w-[600px] my-[5px] rounded-lg">
                    <div className="align-right flex justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" name="edit" className="w-6 h-6 mx-2 stroke-blue-500/50 cursor-pointer hover:stroke-blue-500" onClick={() => setReadOnly(false)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" name="delete" className="w-6 h-6 stroke-blue-500/50 cursor-pointer hover:stroke-blue-500" onClick={() => deleteMutation()}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    </div>
                    <form>
                        <Input 
                        placeholder={"definition"}
                        type="text"
                        input={definition}
                        onChange = {(e) => setDefValue(e.target.value)} 
                        readOnly={readOnly}
                        />
                        <Input 
                        placeholder={"term"}
                        type="text"
                        input={term}
                        value={term ? term : termValue} 
                        onChange={(e) => setTermValue(e.target.value)} 
                        readOnly={readOnly}
                        />
                        { readOnly ?  "" : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" name="checkmark" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-green-500/50 hover:stroke-green-500 cursor-pointer my-2" onClick={() => setReadOnly(true)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        }
                    </form>
                    <div className="align-right flex justify-end">

                    </div>
                </div>
            </div>
    )
}