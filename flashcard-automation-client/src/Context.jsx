import { createContext } from "react";
import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Term from "./components/Term";

const Context = createContext();

export const endpoint = "http://127.0.0.1:5555"

// eslint-disable-next-line react/prop-types
function ContextProvider({ children }) {
    const [currentSetPointer, setCurrentSetPointer] = useState();
    const [terms, setTerms] = useState([{definition: "", term: ""}]);
    const [cardError, setCardError] = useState();
    const [showTitle, setShowTitle] = useState(true);
    const [batch, setBatch] = useState([]);

    const queryClient = useQueryClient();

    const fetchSets = async () => {
        const response = await axios.get(`${endpoint}/sets`)
        setCurrentSetPointer(0)
        return response.data
    };

    const addTerm = () => {
        setTerms([...terms, {definition: "", term: ""}])
    }

    const displayCurrentTerms = terms.map((term) => <Term key={`flashcard-${uuidv4()}`} definition={term.definition} newPost term={term.term}  />)

    const handleSaveClick = () => {
        batch.forEach((val) => {
            const serverRoute = `${endpoint}/flashcards/${val.id}`
            if (val.newPost) {
                postMutation.mutate(val)
            } else {
                updateMutation.mutate(val, serverRoute)
            }
        })
    }

    const updateMutation = useMutation({
    mutationFn: (data, route) => axios.patch(route, 
        JSON.stringify(data), 
        {
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    onSuccess: (resp) => {
        queryClient.setQueryData(['sets'], oldSets => {
            return oldSets.map(set => {
            const data = resp.data
            if (set.id === sets[currentSetPointer].id) {
                const filteredFlashcards = set.flashcards.filter((card) => card.id !== data.id);
                return {
                    ...set, 
                    flashcards: [...filteredFlashcards, data]
                    .sort((a,b) => a.id - b.id)
                }
            }
            return set
            })
        })
    },
    onError: (error) => {
        console.log(error)
    }
    })

    const postMutation = useMutation({
        mutationFn: (data) => axios.post(`${endpoint}/flashcards`, 
        JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        onSuccess: (resp) => {
        queryClient.setQueryData(['sets'], oldSets => {
            const data = resp.data
            return oldSets.map(set => {
                if (set.id === sets[currentSetPointer].id) { 
                    return {
                        ...set,
                        flashcards: [...set.flashcards, data]
                        .sort((a, b) => a.id - b.id)
                    };
                }
            return set;
            });
        });
        },
        // Optionally, handle errors
        onError: (error) => {
            setCardError(error.response.data)
            console.error("Error deleting term:", error);
        }
    });

    // first query for grabbing all the names of sets the user has
    const { data: sets , isLoading: isSetsLoading } = useQuery({ queryKey: ['sets'], queryFn: fetchSets });
    

    const changeSet = (name) => {
        const selectedSet = sets.find((set) => set.name === name)
        if (selectedSet) {
            setCurrentSetPointer(selectedSet.id)
        }
    }

    // let currentSet = sets ? sets.find(set => set.id === currentSetPointer) : null;

    // used for the next dependent query that will execute when the sets query
    // is complete
    const hasSets = sets && sets.length > 0;

    return <Context.Provider value={{ sets, isSetsLoading, hasSets, currentSetPointer, changeSet, postMutation, setTerms, cardError, setCardError, displayCurrentTerms, addTerm, setShowTitle, showTitle, setBatch, batch, handleSaveClick }} >{children}</Context.Provider>
}

export { ContextProvider, Context }