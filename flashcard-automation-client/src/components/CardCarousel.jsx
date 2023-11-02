import { useRef } from 'react'
import FlashCard from './FlashCard.jsx'

export const CourseCarousel = () => {
    const scrollContainer = useRef(null)

    const handleBackClick = () => {
        scrollContainer.current.style.scrollBehavior = 'smooth'
        scrollContainer.current.scrollLeft -= 400
    }

    const handleNextClick = () => {
        scrollContainer.current.style.scrollBehavior = 'smooth'
        scrollContainer.current.scrollLeft += 400
    }

    return (
        <>
        <div className='flex justify-center items-center'>
            {/* handle the back click to the previous flashcard */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer m-2px" onClick={handleBackClick}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <div className='w-1000px flex overflow-x-auto items-center justify-center'>
                {/* <StyledIcon onClick={handleBackClick} /> */}

                <div 
                className='flex flex-nowrap overflow-x-auto h-315px overflow-scroll -webkit-scrollbar:none:' 
                ref={scrollContainer}
                >
                    <div className='flex items-center justify-center m-auto'>
                        <FlashCard />
                    </div>
                </div>
                {/* <StyledIcon as={ArrowRightIcon} onClick={handleNextClick} /> */}
            </div>
            {/* handle the click to the next flashcard */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer m-2px" onClick={handleNextClick}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
        </div>
        </>
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