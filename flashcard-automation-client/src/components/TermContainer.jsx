import Term from "./Term.jsx";
import { useContext } from "react";
import { Context } from "../Context.jsx";
import Title from "./Title.jsx";
import AddButton from "../icons/addButton.jsx";

export default function TermContainer() {
    // const query = useQuery();
    // const queryClient = useQueryClient();
    const { 
        sets,
        currentSetPointer, 
        isSetsLoading, 
        displayCurrentTerms, 
        addTerm,
        showTitle,
        showSaved,
        savedFlashcards } = useContext(Context)

    if (isSetsLoading) {
        return <div>Loading sets...</div>;
    }

    const shouldDisplayTerms = !isSetsLoading && sets[currentSetPointer].flashcards.length > 0

    const displayTerms = () => {
        let flashcardNum = 0;

        if (sets[currentSetPointer].flashcards.length > 0 && !showSaved) {
            return sets[currentSetPointer].flashcards.map((flashcard) => {

                flashcardNum++;
                return (
                <Term 
                key={`flashcard-${flashcard.id}`} 
                id={flashcard.id} 
                term={flashcard.term} 
                definition={flashcard.definition}
                num={flashcardNum} />
                )
            });
        } else if (showSaved) {
            return savedFlashcards.map((flashcard) => {

                flashcardNum++;
                return (
                    <Term 
                    key={`flashcard-${flashcard.id}`} 
                    id={flashcard.id} 
                    term={flashcard.term} 
                    definition={flashcard.definition}
                    num={flashcardNum} />
                )
            })
        } else {
            return [];
        }
    }

    return (
        <div className="my-2">
            { showTitle ? <Title title={sets[currentSetPointer].name} /> : ""}
        <>
            {shouldDisplayTerms ? 
            displayTerms() 
            : 
            <div>Sorry, there are no flashcards to display. Create one!</div>
            } 
            {displayCurrentTerms}
        </>
        <div className="justify-center items-center flex">
            <AddButton addTerm={addTerm} />
        </div>
        </div>
    )
}