import { useRef, useContext, useState } from 'react'
import Flashcard from './FlashCard'
import { Context } from '../Context'

export default function CardCarousel() {
    const { sets, currentSetPointer } = useContext(Context)
    // make the the first value describe the current value being shown in the flashcard
    // have a state variable to handle changes in the query value
    // ensure the query value input has no border

    const scrollContainer = useRef(null);
    const [queryVal, setQueryVal] = useState(1);

    if (!sets) {
        return <div>Loading flashcards...</div>
    }

    const handleFlashcardQuery = (val) => {
        // handle the edge case for an undefined value or backspace
        if (!val) {
            setQueryVal("");
            return;
        }

        const intVal = parseInt(val)
        if (intVal > sets[currentSetPointer].flashcards.length || intVal <= 0) {
            setQueryVal(1);
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
            while (tmpPrevVal < newVal) {
                // essentially clicking the back arrow for you
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
        let tmpVal = queryVal
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal)
        }

        if (queryVal !== 0) {
            setQueryVal(tmpVal - 1);
        }
        shiftScrollContainer("back");
    }

    const handleNextClick = () => {
        let tmpVal = queryVal
        if (typeof tmpVal !== "number") {
            tmpVal = parseInt(tmpVal)
        }
           
        if (sets[currentSetPointer].flashcards[queryVal]) {
            setQueryVal(tmpVal + 1);
        }
        shiftScrollContainer("forward");
    }

    const displayFlashcards = () => {
        return sets[currentSetPointer].flashcards.map((card) => {
            return <Flashcard key={`${card}-${card.id}`} definition={card.definition} term={card.term} />
        })  
    }

    const handleArrowClicks = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
        }
    }

    return (
            <>
            <div className='flex justify-center items-center w-full h-[400px]'>
                { sets[currentSetPointer].flashcards.length > 0 ?
                <>
                <div 
                className='flex justify-center items-center mt-8 w-[585px] scrollbar-hide'
                onKeyDown={(e) => handleArrowClicks(e)}
                tabIndex={0}
                >
                    {/* handle the back click to the previous flashcard */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer mx-2" onClick={handleBackClick}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <div 
                    className='flex overflow-x-auto items-center justify-center scrollbar-hide h-[400px]'
                    >
                        {/* <StyledIcon onClick={handleBackClick} /> */}

                        <div 
                        className='flex flex-nowrap overflow-x-auto h-[350px] overflow-scroll scrollbar-hide' 
                        ref={scrollContainer}
                        >
                            <div 
                            className='flex items-center justify-center m-auto scrollbar-hide h-full'
                            >
                                {displayFlashcards()}
                            </div>
                        </div>
                        {/* <StyledIcon as={ArrowRightIcon} onClick={handleNextClick} /> */}
                    </div>
                    {/* handle the click to the next flashcard */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer mx-2" onClick={handleNextClick}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </div>
                </>
                :
                <div>Sorry, there are no flashcards to display... Create one!</div>
                }
            </div>
                <div className='mb-8'>
                <input
                value={queryVal}
                onChange={(e) => handleFlashcardQuery(e.target.value)}
                className='border-none outline-none w-2'
                />
                {" "} / {sets[currentSetPointer].flashcards.length}
            </div>
            </>
    )
}
