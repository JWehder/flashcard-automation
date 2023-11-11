// eslint-disable-next-line react/prop-types
export default function Input({ input, placeholder, readOnly }) {
    return (
        <>
            <textarea readOnly={readOnly} placeholder={placeholder} value={input} className="p-0.25 text-base border-b-2 border-b-blue-500/50 transition-all duration-0.2 w-full focus:outline-none focus:border-b-blue-500 my-2 font text-gray-500" />
        </>
    )
}