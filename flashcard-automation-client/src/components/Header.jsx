import { useContext } from "react"
import { Context } from "../Context"
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
import { endpoint } from "../Context";

export default function Header() {
    const { currentSet, sets, changeSet, hasSets, setShowTitle } = useContext(Context);
    const [showForm, setShowForm] = useState("");
    const [setName, setSetName] = useState("");

    const queryClient = useQueryClient();

    const removeFormClick = () => {
        setShowForm(false);
        setShowTitle(true);
    }

    const addFormClick = () => {
        setShowForm(true);
        setShowTitle(false);
    }

    const addSet = () => {
        addMutation.mutate({name: setName});
    }

    const addMutation = useMutation({
        mutationFn: (data) => axios.post(`${endpoint}/sets`, data),
        onSuccess: (resp) => {
            const set = resp.data
            queryClient.setQueryData(['sets'], oldSets => {
                return [...oldSets, set]
            });
        },
        onError: (error) => {
            console.error("Error inserting new term:", error);
        }
    });

    const handleSubmit = () => {
        addMutation.mutate(setName);
    }

    return (
        <div>
            <>
                <h1>Flashcard Automation</h1>
                { hasSets ?
                <select>
                    {sets.map((set) =>  <option onSelect={(e) => changeSet(e.target.value)} value={currentSet.name} key={set}>{currentSet.name}</option>)}
                </select>
                :
                ""
                }
                <button className="rounded-full bg-blue-500 hover:bg-blue-700 mx-4 my-3 p-1.5 text-sm text-white border-2" onClick={() => addFormClick()}>
                    create new set +
                </button>
            </>
            { showForm ?
                <div className="flex justify-center mt-4">
                    <form className="flex" onSubmit={handleSubmit}>
                        <input
                        type="text"
                        value={setName}
                        placeholder="Name this set"
                        onChange={(e) => setSetName(e.target.value)}
                        className="p-0.25 text-base border-b-2 border-b-blue-500/50 transition-all duration-0.2 focus:outline-none focus:border-b-blue-500 my-1 text-gray-500 mx-2 outline-none"
                        >
                        </input>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" name="add" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-blue-500 hover:stroke-blue-700 cursor-pointer" onClick={() => addSet()}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer stroke-red-500 hover:stroke-red-700" onClick={() => removeFormClick()}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </form>
                </div>
                :
                ""
            }
            {addMutation.isLoading ? <div>Loading your new set...</div> : ""}
        </div>

    )

}