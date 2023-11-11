import Term from "./Term.jsx";
import { useContext } from "react";
import { Context } from "../Context.jsx";
import { useState } from "react";



export default function TermContainer() {
    // const query = useQuery();
    // const queryClient = useQueryClient();
    const { isSetsLoading, isSetLoading, hasSets, set, sets } = useContext(Context)
    const [terms, setTerms] = useState([<Term key={'term - 1'} />])

    if (isSetsLoading) {
        return <div>Loading sets...</div>;
    }

    if (isSetLoading) {
        return <div>Loading set...</div>
    }

    const flashcards = set.flashcards.map((flashcard) => <Term key={`flashcard-${flashcard.id}`} id={flashcard.id} term={flashcard.answer} definition={flashcard.question} />)

    return (
        <>
        { hasSets ?
            <select>
                {sets.map((set) =>  <option value={set} key={set}>{set}</option>)}
            </select>
         :
            <button className="full-rounded bg-green-500/50 hover:bg-green-500">
                create new set +
            </button>
        }
        <>
            {flashcards} 
            {terms}
        </>
        <div className="justify-center items-center flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-green-500/50 hover:stroke-green-500 cursor-pointer" onClick={() => setTerms([...terms, <Term key={`term - ${terms.length + 1}`} />])}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        </>
    )
}