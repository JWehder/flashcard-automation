import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ContextProvider } from "./Context.jsx"
import { 
    QueryClientProvider,
    QueryClient
} from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client = {queryClient}>
    <ContextProvider>
        <App />
    </ContextProvider>,
    </QueryClientProvider>
)
