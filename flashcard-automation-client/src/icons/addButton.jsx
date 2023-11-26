// eslint-disable-next-line react/prop-types
export default function AddButton({ addTerm }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" name="add" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-green-500/50 hover:stroke-green-500 cursor-pointer" onClick={() => addTerm()}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}