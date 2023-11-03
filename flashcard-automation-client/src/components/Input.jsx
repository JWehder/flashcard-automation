// eslint-disable-next-line react/prop-types
export default function Input({ input, defaultValue }) {
    return (
        <>
            <input defaultValue={defaultValue} value={input} className="p-0.25 text-base border-b-2 border-b-green-500/50 transition-all duration-0.2 w-full focus:outline-none focus:border-b-green-500 hover:border-b-green-500" />
        </>
    )
}