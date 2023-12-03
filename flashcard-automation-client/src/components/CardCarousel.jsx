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
    const [boundary, setBoundary] = useState([]);
    const [currentBoundaryIdx, setCurrentBoundaryIdx] = useState(0);
    const [loadingNewBoundary, setLoadingNewBoundary] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        console.log("boundary");
        console.log(boundary);
    }, [boundary])

    // Looking if new boundary was loaded
    // the most it should run is twice. It should cleanup itself
    useEffect(() => {
        console.log("hitting me?")
        if (boundary.length > 0 && loadingNewBoundary) {
            console.log("I've been hit!")

            // parse the integer in case the value is not an integer
            const intVal = parseInt(queryVal);

            // where is the current value in boundary? What's the index?
            const queryIdx = boundary.findIndex((val) => val === intVal-1);

            // flip through to the correct card
            flipThroughCards(currentBoundaryIdx, queryIdx);
            // set the new boundary index
            setCurrentBoundaryIdx(queryIdx);
            // once changes have been reflected in browser, 
            // turn off loadingNewBoundary
            setLoadingNewBoundary(false);
            
        }

    }, [loadingNewBoundary])

    useEffect(() => {
        if (sets) {
            if (showSaved) {
                setQueryVal('1');
            }

            const flashcards = showSaved ?
            savedFlashcards : sets[currentSetPointer].flashcards

            const flashcardsLen = flashcards.length

            if (flashcardsLen === 1) {
                setBoundary([0]);
                return;
            }


            if (flashcardsLen < 10) {
                setBoundary([...Array(flashcardsLen).keys()]);
            } else {
                setBoundary([...Array(10).keys()]);
            }
        }

    }, [sets, currentSetPointer, showSaved])

    if (!sets) {
        return <div>Loading flashcards...</div>
    }

    // takes in a queryVal, not an index. It is converted to indices
    const createBoundary = (val) => {

        // flashcards
        const flashcards = showSaved ? 
        savedFlashcards : sets[currentSetPointer].flashcards

        // flashcard length 
        const flashcardsLen = flashcards.length;

        // no need for change if already in correct boundary
        // no need for a boundary change if the boundary is less than 10
        if (flashcardsLen < 10 || val === 0 || val > flashcardsLen) {
            return;
        }

        if (flashcardsLen === 1) {
            return [0]
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

        // whenever this method is called, it should inform the app
        // that we are loading a new boundary and there needs to be changes
        // to the client's browser
        setLoadingNewBoundary(true);
        return tmpBoundary;
    }

    const handleFlashcardQuery = (val) => {
        // convert the val to an integer
        const intVal = parseInt(val);

        if (!val) {
            setQueryVal(queryVal);
            return;
        }

        // flashcards 
        const flashcards = sets[currentSetPointer].flashcards

        // bool check if the value is already within the current boundary
        const foundQueryVal = boundary.findIndex((num) => num === intVal-1);

        if (intVal > flashcards.length || intVal <= 0) {
            setQueryVal("1");
            return;
        } 

        if (foundQueryVal !== -1) {
            setQueryVal(val);
            // setting the index of the current queryValue within the boundary
            setCurrentBoundaryIdx(foundQueryVal);
            // flip through cards until we get to the requested card
            flipThroughCards(queryVal, intVal);
        } else {
            // if the requested value is currently not in the boundary
            setQueryVal(val);
            // start at the first value of the new boundary, till you get to 
            // the query value
            setCurrentBoundaryIdx(0);
            // set the new boundary
            // create a new boundary where the value is included in it
            setBoundary(createBoundary(intVal));
            // set loading new boundary to true, to run useEffect
            setLoadingNewBoundary(true);
        }
    }
    // [0, 1, 2, 3, 4, [5, 6, 7, 8, 9, 10, 11, 12], 13, 14, 15, 16, 17, 18]
    //                              ^
    //                         my query val
    // not sure wherever the starting point will ever be.
    // best to reduce the chances of a bug by going to the first value in the list and shifting cards till you get to the right place

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

    const inFlashcards = (val) => {
        // determine which flashcards we'll be searching
        const flashcards = showSaved ?
        savedFlashcards : sets[currentSetPointer].flashcards;

        return flashcards[val];
    }

    const atTheEdge = (tmpBoundaryIdx) => {
        // get the second to last value in boundary
        const secondToLast = boundary[boundary.length - 2];

        // determine which edge the value is
        if (tmpBoundaryIdx === 1 && boundary[tmpBoundaryIdx] !== 1) {
            return 1;
        } else if (boundary[tmpBoundaryIdx] === secondToLast) {
            return -1;
        } else {
            return null;
        }

    }

    // bool test to see if boundary needs to be expanded
    const expandBoundary = (tmpBoundaryIdx) => {
        const edge = atTheEdge(tmpBoundaryIdx);

        let inFlashcardsBool = false;

        // is it at the edge of the boundary?
        if (edge === 1) {
            // if it's at the front edge, determine if the values behind it 
            // are in the flashcard
            inFlashcardsBool = inFlashcards(boundary[tmpBoundaryIdx] - 2);
        } else if (edge === -1) {
            // if the value is at the back edge, determine if the values in 
            // front of it are available
            inFlashcardsBool = inFlashcards(boundary[tmpBoundaryIdx] + 2);
        }

        return inFlashcardsBool;
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
        let tmpBoundaryIdx = currentBoundaryIdx - 1;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }

        if (tmpVal !== 0 && (tmpVal - 1) !== 0) {
            setQueryVal(tmpVal - 1);
            setCurrentBoundaryIdx(tmpBoundaryIdx);
            setWheelThreshold(wheelThreshold - 400);
            if (expandBoundary(tmpBoundaryIdx)) {
                setBoundary(createBoundary());
                setLoadingNewBoundary(true);
                return;
            }
            shiftScrollContainer("back", tmpBoundaryIdx);
        }

    }

    const handleNextClick = () => {
        let tmpVal = queryVal;
        let tmpBoundaryIdx = currentBoundaryIdx + 1;
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal);
        }
           
        if (sets[currentSetPointer].flashcards[queryVal]) {
            setQueryVal(tmpVal + 1);
            setCurrentBoundaryIdx(tmpBoundaryIdx);
            setWheelThreshold(wheelThreshold + 400);
            if (expandBoundary(tmpBoundaryIdx)) {
                console.log("forward");
                setBoundary(createBoundary());
                setLoadingNewBoundary(true);
                return;
            }
            shiftScrollContainer("forward", tmpBoundaryIdx);
        }

    }

    const handleWheel = () => {
        let tmpVal = parseInt(queryVal);

        const container = scrollContainer.current

        console.log(container.scrollLeft);

        if (container.scrollLeft === 400) {
            console.log(container.scrollLeft, wheelThreshold);
            console.log(container.scrollLeft % 300)
            return;
        }
        

        if (container.scrollLeft > (wheelThreshold + 400)) {
            setWheelThreshold(wheelThreshold + 400);
            console.log(wheelThreshold);
            if (sets[currentSetPointer].flashcards[tmpVal]) {
                setQueryVal(tmpVal + 1);
                setCurrentBoundaryIdx(currentBoundaryIdx + 1);
            }
        } else if (container.scrollLeft <= (wheelThreshold - 400)) {
            setWheelThreshold(wheelThreshold - 400);
            if (tmpVal - 1 !== 0) {
                setQueryVal(tmpVal - 1);
                setCurrentBoundaryIdx(currentBoundaryIdx - 1);
            }
        } else {
            return;
        }
    }

    const displayFlashcards = () => {
        const set = sets[currentSetPointer]
        return boundary.map((index) => {
            const card = set.flashcards[index]
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
        return boundary.map((index) => {
            const card = savedFlashcards[index];
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
