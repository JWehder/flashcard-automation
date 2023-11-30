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
    const [wheelThreshold, setWheelThreshold] = useState(0);
    const [boundary, setBoundary] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (showSaved) {
            setQueryVal('1');
        }

    }, [showSaved])

    useEffect(() => {
        if (sets) {
            const flashcardsLen = sets[currentSetPointer].flashcards.length

            if (flashcardsLen < 10) {
                setBoundary([...Array(flashcardsLen).keys()]);
            } else {
                setBoundary([...Array(10).keys()]);
            }
        }


    }, [sets, currentSetPointer])

    if (!sets) {
        return <div>Loading flashcards...</div>
    }

    const handleFlashcardQuery = (val) => {
        // convert the val to an integer
        const intVal = parseInt(val);

        // flashcards 
        const flashcards = sets[currentSetPointer].flashcards

        // bool check if the value is already within the current boundary
        const foundQueryVal = boundary.find((num) => num === val-1);

        // handle the edge case for an undefined value or backspace
        if (!val) {
            setQueryVal(queryVal);
            return;
        }

        if (intVal > flashcards.length || intVal <= 0) {
            setQueryVal("1");
            return;
        } 

        if (foundQueryVal) {
            // flip through cards until we get to the requested card
            flipThroughCards(queryVal, intVal);
        } else {
            createBoundary(intVal);
        }

    }

    const createBoundary = (val) => {

        // flashcards
        const flashcards = sets[currentSetPointer].flashcards

        // flashcard length 
        const flashcardsLen = flashcards.length;

        // no need for change if already in correct boundary
        // no need for a boundary change if the boundary is less than 10
        if (flashcardsLen < 10 || val === 0 || val > flashcardsLen) {
            return;
        }

        // the local tmpBoundary for access around the rest of the func
        let tmpBoundary = [];

        // check if the value is zero or the last index in the flashcards array
        if (val - 1 === 0) {
            tmpBoundary = [...Array(10).keys()];
        } else if (val === flashcardsLen) {
            let counter = 10;
            while (counter > 0) {
                tmpBoundary.push(flashcardsLen - counter);
                counter--;
            }
        }
        
        if (flashcards[val - 4] && flashcards[val + 4]) {
            let counter = 4;
            while (counter >= 0) {
                tmpBoundary.push(val - counter);
                counter--;
            }
            counter = 1;
            while (counter <= 5) {
                tmpBoundary.push(val + counter);
                counter++;
            }
        } else if ((val - 1) !== 0 && val !== flashcardsLen) {
            let prefixDiff = val - 0;
            let postfixDiff = (flashcardsLen - 1) - val;
            if (prefixDiff > postfixDiff) {
                let counter = 4;
                while (counter >= 0) {
                    tmpBoundary.push(val - counter);
                    counter--;
                }
                counter = 1;
                while (counter <= postfixDiff) {
                    tmpBoundary.push(val + counter);
                    counter++;
                }
            } else {
                let counter = prefixDiff;
                while (counter >= 0) {
                    tmpBoundary.push(val - counter);
                    counter--;
                }
                counter = 1;
                while (counter <= 5) {
                    tmpBoundary.push(val + counter);
                    counter++;
                }
            }
        }

        flipThroughCards(Math.floor(tmpBoundary.length / 2), val);
    }

    // creating another function to actually handle the action of flipping 
    // through the cards
    const flipThroughCards = async (prevVal, newVal) => {
        // value with the ability to be rapidly incremented and decremented
        let tmpPrevVal = prevVal

        // method giving the browser enough time to react to the rapid change 
        // in styling
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        if (prevVal < newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            while (tmpPrevVal <= newVal) {
                await delay(1000);
                // essentially clicking the back arrow for you
                shiftScrollContainer("forward");
                tmpPrevVal++;
            }
        } else if (prevVal > newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            while (tmpPrevVal > newVal) {
                await delay(1000);
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

        const foundValue = boundary.find((num) => num === tmpVal - 3);

        if (!foundValue) {
            createBoundary(tmpVal - 1);
        }   
    }

    const handleNextClick = () => {
        let tmpVal = queryVal;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }
           
        if (sets[currentSetPointer].flashcards[queryVal]) {
            setQueryVal(tmpVal + 1);
            shiftScrollContainer("forward");
        }

        const foundValue = boundary.find((num) => num === tmpVal + 3);

        if (!foundValue) {
            createBoundary(tmpVal + 1);
        }   
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
