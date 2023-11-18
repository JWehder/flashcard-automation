import Term from "./Term.jsx";
import { useContext } from "react";
import { Context } from "../Context.jsx";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function TermContainer() {
    // const query = useQuery();
    // const queryClient = useQueryClient();
    const { currentSet, isSetsLoading } = useContext(Context)
    const [terms, setTerms] = useState([{definition: "", term: ""}])

    if (isSetsLoading) {
        return <div>Loading sets...</div>;
    }

    const shouldDisplayTerms = !isSetsLoading && currentSet.flashcards.length < 1

    const displayTerms = () => {

        if (currentSet.flashcards.length > 0) {
            return currentSet.flashcards.map((flashcard) => <Term key={`flashcard-${flashcard.id}`} id={flashcard.id} term={flashcard.answer} definition={flashcard.question} />);
        } else {
            return [];
        }
    }

    const displayCurrentTerms = terms.map((term) => <Term key={`flashcard-${uuidv4()}`} definition={term.definition} newPost term={term.term}  />)

    return (
        <div className="my-2">
        <>
            {shouldDisplayTerms ? 
            displayTerms() 
            : 
            <div>Sorry, there are no flashcards to display. Create one!</div>
            } 
            {displayCurrentTerms}
        </>
        <div className="justify-center items-center flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" name="add" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-green-500/50 hover:stroke-green-500 cursor-pointer" onClick={() => setTerms([...terms, <Term key={`term - ${terms.length + 1}`} />])}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        </div>
    )
}