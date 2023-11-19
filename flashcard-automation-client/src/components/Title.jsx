import { useState, useContext } from "react"
import { Context } from "../Context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { endpoint } from "../Context";

// eslint-disable-next-line react/prop-types
export default function Title() {
    const { sets, currentSetPointer, handleSaveClick } = useContext(Context);

    const path = `${endpoint}/sets/${currentSetPointer}`

    const [readOnly, setReadOnly] = useState(true);
    const [currentName, setCurrentName] = useState(sets[currentSetPointer].name);

    const queryClient = useQueryClient();

    const handleFocus = () => {
        setReadOnly(false)
    }

    const handleBlur = () => {
        if (currentName === sets[currentSetPointer].name) {
            setCurrentName(sets[currentSetPointer].name)
        } else {
            updateMutation.mutate({name: currentName})
        }
        setReadOnly(true)
        
    }

    const updateMutation = useMutation({
        mutationFn: (data) => axios.patch(path, 
            JSON.stringify(data), 
            {
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        onSuccess: (resp) => {
            queryClient.setQueryData(['sets'], oldSets => {
                const set = resp.data
                const filteredSets = oldSets.filter((set) => set.id !== sets[currentSetPointer].id);
                return [...filteredSets, set]
            })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    return (
        <>
            <div 
            className="flex my-2 mt-4 justify-center"
            onBlur={handleBlur}
            >
                <input 
                value={currentName} 
                readOnly={readOnly} 
                className="text-2xl border-b-2 border-blue-500 hover:border-blue-700 text-center outline-none" 
                onChange={(e) => setCurrentName(e.target.value)}
                onFocus={handleFocus}
                />
            </div>
            <>
                <button className="border-2 p-3 text-lg rounded-full bg-blue-500 text-white hover:bg-blue-700 my-3" onClick={handleSaveClick}>
                    Save Changes
                </button>
            </>
        </>
    )
}