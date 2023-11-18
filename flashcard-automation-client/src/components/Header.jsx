import { useContext } from "react"
import { Context } from "../Context"
import { useState } from "react";


export default function Header() {
    const { currentSet, sets, changeSet, hasSets } = useContext(Context);
    const [showForm, setShowForm] = useState("");
    const [setName, setSetName] = useState("");

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
                <button className="rounded-full bg-blue-500 hover:bg-blue-700 mx-4 my-3 p-1.5 text-sm text-white" onClick={() => setShowForm(true)}>
                    create new set +
                </button>
            </>
            { showForm ?
                <div className="flex align-center items-center">
                    <form>
                        <input
                        type="text"
                        value={setName}
                        placeholder="Name this set"
                        onChange={(e) => setSetName(e.target.value)}
                        className="p-0.25 text-base border-b-2 border-b-blue-500/50 transition-all duration-0.2 focus:outline-none focus:border-b-blue-500 my-1 text-gray-500"
                        >
                        </input>
                    </form>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                :
                ""
            }
        </div>

    )

}