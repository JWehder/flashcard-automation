// eslint-disable-next-line react/prop-types
export default function CheckMark({ newPost, submitEdit, submitPost}) {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" name="checkmark" strokeWidth={1.5} stroke="currentColor" onClick={newPost ? submitPost : submitEdit} className="w-6 h-6 stroke-green-500/50 hover:stroke-green-500 cursor-pointer my-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}