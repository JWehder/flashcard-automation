import { useRef, useContext, useState } from 'react'
import Flashcard from './FlashCard'
import { Context } from '../Context'
import BackButton from '../icons/backbutton';
import NextButton from '../icons/nextButton';

export default function CardCarousel() {
    const { sets, currentSetPointer } = useContext(Context)

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

        if (tmpVal !== 0 && (tmpVal - 1) !== 0) {
            setQueryVal(tmpVal - 1);
            shiftScrollContainer("back");
        }
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

    const handleWheel = () => {
        console.log(scrollContainer.current.scrollLeft);
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
            <div 
            className='flex justify-center items-center w-full h-full'>
                { sets[currentSetPointer].flashcards.length > 0 ?
                <>
                <div 
                className='flex justify-center items-center mt-8 w-[585px] scrollbar-hide'
                onKeyDown={(e) => handleArrowClicks(e)}
                tabIndex={0}
                >
                    <BackButton handleBackClick={handleBackClick} />
                    <div 
                    className='flex overflow-x-auto items-center justify-center scrollbar-hide h-[400px]'
                    >

                        <div 
                        className='flex flex-nowrap overflow-x-auto h-[350px] overflow-scroll scrollbar-hide' 
                        ref={scrollContainer}
                        onWheel={() => handleWheel()}
                        >
                            <div 
                            className='flex items-center justify-center m-auto scrollbar-hide h-full'
                            >
                                {displayFlashcards()}
                            </div>
                        </div>
                    </div>
                    {/* handle the click to the next flashcard */}
                    <NextButton handleNextClick={handleNextClick} />
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
                className='border-none outline-none w-2 text-blue-500'
                />
                {" "} / {sets[currentSetPointer].flashcards.length}
            </div>
            </>
    )
}
