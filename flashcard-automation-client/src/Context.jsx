import { createContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Context = createContext();

export const endpoint = "http://127.0.0.1:5555"

const fetchSets = async () => {
    const response = await axios.get(`${endpoint}/sets`)
    console.log(response.data[0])
    return response.data
};

const fetchSet = async () => {
    const response = await axios.get(`${endpoint}/default_set`)
    return response.data
};

// eslint-disable-next-line react/prop-types
function ContextProvider({ children }) {

    // first query for grabbing all the names of sets the user has
    const { data: sets , isLoading: isSetsLoading } = useQuery({ queryKey: ['sets'], queryFn: fetchSets });

    // used for the next dependent query that will execute when the sets query
    // is complete
    const hasSets = sets && sets.length > 0;

    const { data: set, isLoading: isSetLoading } = useQuery({
        queryKey: ['set'],
        enabled: !!hasSets,
        queryFn: fetchSet
    })

    return <Context.Provider value={{ isSetLoading, set, sets, isSetsLoading, hasSets }} >{children}</Context.Provider>
}

export { ContextProvider, Context }