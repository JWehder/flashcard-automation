import { createContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Context = createContext();

export const endpoint = "http://127.0.0.1:5555"

// eslint-disable-next-line react/prop-types
function ContextProvider({ children }) {
    const [currentSetPointer, setCurrentSetPointer] = useState()

    const fetchSets = async () => {
        const response = await axios.get(`${endpoint}/sets`)
        setCurrentSetPointer(response.data[0].id)
        return response.data
    };

    // first query for grabbing all the names of sets the user has
    const { data: sets , isLoading: isSetsLoading } = useQuery({ queryKey: ['sets'], queryFn: fetchSets });
    

    const changeSet = (name) => {
        const selectedSet = sets.find((set) => set.name === name)
        if (selectedSet) {
            setCurrentSetPointer(selectedSet.id)
        }
    }

    let currentSet = sets ? sets.find(set => set.id === currentSetPointer) : null;

    // used for the next dependent query that will execute when the sets query
    // is complete
    const hasSets = sets && sets.length > 0;

    return <Context.Provider value={{ sets, isSetsLoading, hasSets, currentSetPointer, changeSet, currentSet }} >{children}</Context.Provider>
}

export { ContextProvider, Context }