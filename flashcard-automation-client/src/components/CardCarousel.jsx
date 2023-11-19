import { useRef, useContext, useState } from 'react'
import FlashCard from './FlashCard'
import { Context } from '../Context'
import { useEffect } from 'react'

export default function CardCarousel() {
    const { currentSet } = useContext(Context)

    const scrollContainer = useRef(null)

    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)

    useEffect(() => {
        if (currentSet) {
            setCurrentFlashcardIndex(0)
        }

    }, [currentSet])

    if (!currentSet) {
        return <div>Loading flashcards...</div>
    }

    const handleBackClick = () => {
        if (currentFlashcardIndex !== 0) {
            setCurrentFlashcardIndex(currentFlashcardIndex - 1)
        }
        
        scrollContainer.current.style.scrollBehavior = 'smooth'
        scrollContainer.current.scrollLeft -= 400
    }

    const handleNextClick = () => {
        if (currentSet.flashcards[currentFlashcardIndex + 1]) {
            setCurrentFlashcardIndex(currentFlashcardIndex + 1)
        }

        scrollContainer.current.style.scrollBehavior = 'smooth'
        scrollContainer.current.scrollLeft += 400
    }

    return (
        <div>
            { currentSet.flashcards.length > 0 ?
            <>
            <div className='flex justify-center items-center mt-8'>
                {/* handle the back click to the previous flashcard */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer mx-2" onClick={handleBackClick}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <div className='w-1000px flex overflow-x-auto items-center justify-center'>
                    {/* <StyledIcon onClick={handleBackClick} /> */}

                    <div 
                    className='flex flex-nowrap overflow-x-auto h-315px overflow-scroll -webkit-scrollbar:none:' 
                    ref={scrollContainer}
                    >
                        <div className='flex items-center justify-center m-auto'>
                            <FlashCard 
                            definition={currentSet.flashcards[currentFlashcardIndex].definition} 
                            term={currentSet.flashcards[currentFlashcardIndex].term}
                            />
                        </div>
                    </div>
                    {/* <StyledIcon as={ArrowRightIcon} onClick={handleNextClick} /> */}
                </div>
                {/* handle the click to the next flashcard */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer mx-2" onClick={handleNextClick}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </div>
            <div className='mb-8'>
                {currentFlashcardIndex + 1} / {currentSet.flashcards.length}
            </div>
            </>
            :
            <div>Sorry, there are no flashcards to display... Create one!</div>
            }
        </div>
    )
}

// const Gallery = styled.div`
//     width: 1000px;
//     display: flex;
//     overflow-x: scroll;
//     align-items: center;
//     justify-content:center;

// `

// const List = styled.div`
//     display: flex;
//     flex-wrap: nowrap;
//     overflow-x: auto;
//     height: 315px;
//     overflow: scroll;

//     &::-webkit-scrollbar {
//         display: none;
//     }
// `

// const GalleryWrap = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: 10% auto;
// `

// const StyledIcon = styled(Icon)`
//     cursor: pointer;
//     margin: 2px;
// `