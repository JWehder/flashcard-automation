import { useRef, useContext, useState } from 'react'
import Flashcard from './FlashCard'
import { Context } from '../Context'
import BackButton from '../icons/backbutton';
import NextButton from '../icons/nextButton';
import { useEffect } from 'react';

export default function CardCarousel() {
    const { 
        sets, 
        currentSetPointer, 
        showSaved,
        savedFlashcards } = useContext(Context)

    const scrollContainer = useRef(null);
    const [queryVal, setQueryVal] = useState(1);
    const [wheelThreshold, setWheelThreshold] = useState(325);

    const inputRef = useRef(null);

    useEffect(() => {
        if (sets) {
            if (showSaved) {
                setQueryVal('1');
            }

            }
    }, [sets, currentSetPointer, showSaved])

    if (!sets) {
        return <div>Loading flashcards...</div>
    }

    const handleFlashcardQuery = (val) => {
        // convert the val to an integer
        const intVal = parseInt(val);

        // current set's flashcards 
        const flashcards = sets[currentSetPointer].flashcards

        if (!val || intVal > flashcards.length || intVal <= 0) {
            setQueryVal(queryVal);
            return;
        }

        setQueryVal(val);
        // flip through cards until we get to the requested card
        flipThroughCards(queryVal, intVal);

    }

    // creating another function to actually handle the action of flipping 
    // through the cards
    const flipThroughCards = async (prevVal, newVal) => {

        if (prevVal < newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            shiftScrollContainer("forward", newVal);
        } else if (prevVal > newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            shiftScrollContainer("back", newVal)
        }
    }

    const shiftScrollContainer = (direction, tmpVal) => {
        const container = scrollContainer.current;
        if (!container) return;

        let newScrollLeft;

        if (direction === "back") {
            newScrollLeft = 532 * tmpVal
        } else if (direction === "forward") {
            newScrollLeft = 532 * tmpVal;
        }

        container.style.scrollBehavior = 'smooth';
        container.scrollLeft = newScrollLeft;
    }


    const handleBackClick = () => {
        let tmpVal = queryVal;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }

        if (tmpVal !== 0 && (tmpVal - 1) !== 0) {
            setQueryVal(tmpVal - 1);
            setWheelThreshold(wheelThreshold - 400);
            shiftScrollContainer("back", tmpVal);
        }

    }

    const handleNextClick = () => {
        let tmpVal = queryVal;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }
           
        if (sets[currentSetPointer].flashcards[queryVal]) {
            setQueryVal(tmpVal + 1);
            setWheelThreshold(wheelThreshold + 400);
            shiftScrollContainer("forward", tmpVal);
        }

    }

    const handleWheel = () => {
        let tmpVal = parseInt(queryVal);

        const container = scrollContainer.current

        console.log(container.scrollLeft);

        if (350 <= container.scrollLeft <= 400) {
            console.log(container.scrollLeft, wheelThreshold);
            console.log(container.scrollLeft % 300)
            return;
        }
        
        // if the scrollbar has progressed past the wheelThreshold range
        if (container.scrollLeft > (wheelThreshold + 400)) {
            setWheelThreshold(wheelThreshold + 400);
            console.log(wheelThreshold);
            if (sets[currentSetPointer].flashcards[tmpVal]) {
                setQueryVal(tmpVal + 1);
            }
        } else if (container.scrollLeft <= (wheelThreshold - 400)) {
            setWheelThreshold(wheelThreshold - 400);
            if (tmpVal - 1 !== 0) {
                setQueryVal(tmpVal - 1);
            }
        } else {
            return;
        }
    }

    const displayFlashcards = () => {
        const flashcards = sets[currentSetPointer].flashcards;
        return flashcards.map((card) => {
            return (
                <Flashcard 
                key={`card-${card.id}`} 
                id={card.id}
                definition={card.definition} 
                term={card.term}
                saved={card.saved}
                />
            );
        });  
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
