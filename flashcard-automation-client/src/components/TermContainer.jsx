import { useEffect } from "react"
import Term from "./Term.jsx"

export default function TermContainer() {

    // const fetchedTerms = useEffect(() => {
    //     // grab terms from backend
    // }, [])

    const { isLoading, data, error } = useQuery({
        queryKey: ['sets', ]
    })

    // const [terms, setCurrentTerms] = useState([])

    return (
        <>
        <div className="p-[12px] justify-center items-center flex m-0">
            <Term />
            {/* {fetchedTerms.map((term) => <Term key={`term-${term.id}`} id={term.id} term={term.answer} definition={term.question} />)} */}
            {/* {
                terms.map((term) => )
            } */}

        </div>
        <div className="justify-center items-center flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-green-500/50 hover:stroke-green-500 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        </>
    )
}