import { createContext, useState } from "react";

const Context = createContext();

// eslint-disable-next-line react/prop-types
function ContextProvider({ children }) {

    const [readOnly, setReadOnly] = useState(true)

    return <Context.Provider value={{ readOnly, setReadOnly }} >{children}</Context.Provider>
}

export { ContextProvider, Context }