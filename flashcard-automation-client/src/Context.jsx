import { createContext } from "react";

const Context = createContext();

export const endpoint = "http://127.0.0.1:5555"

// eslint-disable-next-line react/prop-types
function ContextProvider({ children }) {

    

    return <Context.Provider value={{ }} >{children}</Context.Provider>
}

export { ContextProvider, Context }