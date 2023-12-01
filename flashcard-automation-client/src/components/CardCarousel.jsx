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
    const [currentBoundaryIdx, setCurrentBoundaryIdx] = useState(0);

    const inputRef = useRef(null);

    // method giving the browser enough time to react to the rapid change 
    // in styling
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

        console.log("show saved is changed")

    }, [sets, currentSetPointer, showSaved])

    if (!sets) {
        return <div>Loading flashcards...</div>
    }

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
            // create a new boundary where the value is included in it
            setBoundary(createBoundary(intVal));
            // start at the first value of the new boundary, till you get to 
            // the query value
            setCurrentBoundaryIdx(0);
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
        // value with the ability to be rapidly incremented and decremented
        let tmpPrevVal = prevVal

        if (prevVal < newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            while (tmpPrevVal <= newVal) {
                // give the browser time to react
                await delay(500);
                // essentially clicking the back arrow for you
                shiftScrollContainer("forward", currentBoundaryIdx + 1);
                tmpPrevVal++;
            }
        } else if (prevVal > newVal) {
            // shift the scroll container over until the previous value meets 
            // the requested value
            while (tmpPrevVal > newVal) {
                // give the browser time to react
                await delay(500);
                // essentially clicking through the cards for you
                shiftScrollContainer("back", currentBoundaryIdx - 1);
                tmpPrevVal--;
            }
        }
    }

    // bool test to see if boundary needs to be expanded
    const expandBoundary = () => {
        const flashcards = showSaved ?
        savedFlashcards : sets[currentSetPointer].flashcards;
        // how do we determine when to change the boundary
        // the value is one away from the edge and there is an index available in flashcards
        // find if it is almost at the edge
        // how do we get the index: find(val, idx)
        // [5, 6, 7, 8, 9, 10] 
        //     ^
        //  0, 1, 2, 3, 4, 5
        // tmpVal is 6, meaning it is the sixth index in flashcards but it is the 1 element in boundary
        // first determine where the index is in boundary, check if it is one away from zero. IF it is, move it on to the next process
        // the next process is determining is the current query value - 2 available in the current iteration of flashcards

        // if its at the end of the boundary and there is available real 
        // estate to grow, change the boundary
        return inFlashcards;
    }

    const atTheEdge = () => {

        // find the index of the value within boundary
        const queryValIdx = boundary.findIndex((val) => 
        val === (queryVal - 1));

        // is the index of the current queryVal at the edge of the boundary
        return queryValIdx === 1 || boundary[boundary.length - 2];
    }

    const shiftScrollContainer = (direction, tmpVal) => {
        const container = scrollContainer.current;
        if (!container) return;

        let newScrollLeft;

        console.log(container.scrollLeft)

        if (direction === "back") {
            if (tmpVal === 0) {
                newScrollLeft = 0;
            } else {
                newScrollLeft = 530 * tmpVal
            }
        } else if (direction === "forward") {
            newScrollLeft = 530 * tmpVal
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
            shiftScrollContainer("back", tmpBoundaryIdx);
        }

        // if (atTheEdge()) {    

        // }   

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
            shiftScrollContainer("forward", tmpBoundaryIdx);
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
