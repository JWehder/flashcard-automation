import { useRef, useContext, useState } from 'react'
import Flashcard from './FlashCard'
import { Context } from '../Context'
import BackButton from '../icons/backbutton';
import NextButton from '../icons/nextButton';

export default function CardCarousel() {
    const { 
        sets, 
        currentSetPointer, 
        showSaved,
        savedFlashcards } = useContext(Context)

    const scrollContainer = useRef(null);
    const [queryVal, setQueryVal] = useState(1);
    const [wheelThreshold, setWheelThreshold] = useState(0);
    const inputRef = useRef(null)

    if (!sets) {
        return <div>Loading flashcards...</div>
    }

    const handleFlashcardQuery = (val) => {
        // handle the edge case for an undefined value or backspace
        if (!val) {
            setQueryVal(queryVal);
            return;
        }

        const intVal = val
        if (intVal > sets[currentSetPointer].flashcards.length || intVal <= 0) {
            setQueryVal("1");
            return;
        } 
        // the value represented within the input box
        setQueryVal(intVal);
        // flip through cards until we get to the requested card
        flipThroughCards(queryVal, intVal);

    }

    // creating another function to actually handle the action of flipping 
    // through the cards
    const flipThroughCards = (prevVal, newVal) => {
        let tmpPrevVal = prevVal
        if (prevVal < newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            while (tmpPrevVal <= newVal) {
                // essentially clicking the back arrow for you
                console.log(tmpPrevVal);
                shiftScrollContainer("forward");
                tmpPrevVal++;
            }
        } else if (prevVal > newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            while (tmpPrevVal > newVal) {
                // essentially clicking through the cards for you
                shiftScrollContainer("back");
                tmpPrevVal--;
            }
        }
        setQueryVal(newVal);
    }

    const shiftScrollContainer = (direction) => {
        if (direction === "back") {
            scrollContainer.current.style.scrollBehavior = 'smooth'
            scrollContainer.current.scrollLeft -= 530
        } else if (direction === "forward") {
            scrollContainer.current.style.scrollBehavior = 'smooth'
            scrollContainer.current.scrollLeft += 530
        }
    }

    const handleBackClick = () => {
        let tmpVal = queryVal;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }

        if (tmpVal !== 0 && (tmpVal - 1) !== 0) {
            setQueryVal(tmpVal - 1);
            shiftScrollContainer("back");
        }
    }

    const handleNextClick = () => {
        let tmpVal = queryVal;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }
           
        if (sets[currentSetPointer].flashcards[queryVal]) {
            setQueryVal(tmpVal + 1);
        }
        shiftScrollContainer("forward");
    }

    const handleWheel = () => {
        let tmpVal = parseInt(queryVal);
        if (scrollContainer.current.scrollLeft > (wheelThreshold + 325)) {
            setWheelThreshold(wheelThreshold + 325);
            if (sets[currentSetPointer].flashcards[tmpVal]) {
                setQueryVal(tmpVal + 1);
            }
        } else if (scrollContainer.current.scrollLeft <= (wheelThreshold - 325)) {
            setWheelThreshold(wheelThreshold - 325);
            if (tmpVal - 1 !== 0) {
                setQueryVal(tmpVal - 1);
            }
        } else {
            return;
        }
    }

    const displayFlashcards = () => {
        return sets[currentSetPointer].flashcards.map((card) => {
            return (
                <Flashcard 
                key={`card-${card.id}`} 
                id={card.id}
                definition={card.definition} 
                term={card.term} 
                saved={card.saved}
                />
            );
        })  
    }

    const displaySavedFlashcards = () => {
        return savedFlashcards.map((card) => {
            return (
                <Flashcard 
                key={`card-${card.id}`} 
                id={card.id}
                definition={card.definition} 
                term={card.term} 
                saved={card.saved}
                />
            );
        })
    }

    const handleArrowClicks = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }

    return (
            <>
                <div 
                className='flex justify-center items-center align-center'>
                    <div className='justify-center w-8'>
                        <BackButton handleBackClick={handleBackClick} />
                    </div>
                    { sets[currentSetPointer].flashcards.length > 0 ?
                    <>
                    <div 
                    className='flex justify-center items-center mt-3 w-[525px] scrollbar-hide'
                    onKeyDown={(e) => handleArrowClicks(e)}
                    tabIndex={0}
                    >
                        <div 
                        className='flex overflow-x-auto items-center scrollbar-hide'
                        >
                            <div 
                            className='flex flex-nowrap overflow-x-auto overflow-scroll scrollbar-hide w-full h-[350px] align-baseline' 
                            ref={scrollContainer}
                            onWheel={() => handleWheel()}
                            >
                                <div 
                                className='flex items-center justify-center m-auto scrollbar-hide'
                                >
                                    {showSaved ? 
                                    displaySavedFlashcards() : displayFlashcards()
                                    }
                                </div>
                            </div>
                        </div>
                        {/* handle the click to the next flashcard */}
                        
                    </div>
                    </>
                    :
                    <div>Sorry, there are no flashcards to display... Create one!</div>
                    }
                    <div className='justify-center w-8'>
                        <NextButton handleNextClick={handleNextClick} />
                    </div>
                </div>
                <div>
                    <input
                    value={queryVal}
                    ref={inputRef}
                    onChange={(e) => handleFlashcardQuery(e.target.value)}
                    className='border-none outline-none text-blue-500 text-center mr-1 w-3'
                    />
                    / {showSaved ? 
                    savedFlashcards.length : 
                    sets[currentSetPointer].flashcards.length}
                </div>
            </>
    )
}
