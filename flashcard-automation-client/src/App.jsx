import CardCarousel from "./components/CardCarousel.jsx"
import TermContainer from "./components/TermContainer.jsx"

export default function App() {

  return (
    <div className="mx-[200px] text-center">
      <h1>Flashcard Automation</h1>
      <select>
        <option value="Python">Python</option>
        <option value="Javascript">Javascript</option>
      </select>
      <CardCarousel />
      <TermContainer />
    </div>
  )
}
