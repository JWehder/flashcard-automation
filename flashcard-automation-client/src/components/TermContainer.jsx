import Term from "./Term.jsx"
import { useQuery } from "@tanstack/react-query"
import { endpoint } from "../Context.jsx";
import axios from "axios";

const fetchSets = async () => {
    const response = await axios.get(`${endpoint}/sets`)
    console.log(response.data[0])
    return response.data[0]
};

const fetchSet = async () => {
    const response = await axios.get(`${endpoint}/default_set`)
    return response.data
};

export default function TermContainer() {
    // const query = useQuery();
    // const queryClient = useQueryClient();

    const { sets , isLoading: isSetsLoading } = useQuery({ queryKey: ['sets'], queryFn: fetchSets });

    const { set, isLoading: isSetLoading } = useQuery({
        queryKey: 'set',
        enabled: !!sets,
        queryFn: fetchSet
    })

    
    if (isSetsLoading) {
        return <div>Loading sets...</div>;
    }

    if (isSetLoading) {
        return <div>Loading set...</div>
    }

    return (
        <>
        <select>
            {sets?.map((set) =>  <option value={set} key={set} />)}
        </select>
        <div className="p-[12px] justify-center items-center flex m-0">
            <Term />
            {set.flashcards.map((flashcard) => <Term key={`flashcard-${flashcard.id}`} id={flashcard.id} term={flashcard.answer} definition={flashcard.question} />)} 

        </div>
        <div className="justify-center items-center flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-green-500/50 hover:stroke-green-500 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        </>
    )
}