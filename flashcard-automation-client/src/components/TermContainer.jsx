import Term from "./Term.jsx"
import { useQuery } from "@tanstack/react-query"
import { endpoint } from "../Context.jsx";

const fetchSets = async ({ signal }) => {
    const response = await fetch(`${endpoint}/sets`, { signal })
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json()
};

const fetchSet = async ({ signal }) => {
    const response = await fetch(`${endpoint}/default_set`, { signal })
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json()
};

export default function TermContainer() {
    // const query = useQuery();
    // const queryClient = useQueryClient();

    const { sets , isLoading: isSetsLoading } = useQuery({ queryKey: ['sets'], queryFn: fetchSets });

    const { set, isLoading: isSetLoading } = useQuery({
        queryKey: ['set'],
        enabled: !!sets,
        queryFn: fetchSet
    })

    
    if (isSetsLoading) {
        return <div>Loading sets...</div>;
    }

    if (isSetLoading) {
        return <div>Loading set...</div>
    }

    // const [terms, setCurrentTerms] = useState([])

    return (
        <>
        <select>
            {sets?.map((set) =>  <option value={set.name} key={`${set.name}-${set.id}`}  />)}
        </select>
        <div className="p-[12px] justify-center items-center flex m-0">
            <Term />
            {set.terms.map((term) => <Term key={`term-${term.id}`} id={term.id} term={term.answer} definition={term.question} />)} 

        </div>
        <div className="justify-center items-center flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-green-500/50 hover:stroke-green-500 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        </>
    )
}