import TermContainer from "./components/TermContainer.jsx"
import Header from "./components/Header.jsx"
import CardCarousel from "./components/CardCarousel.jsx"

export default function App() {

  return (
    <div className="mx-[200px] text-center">
      <Header />
      <CardCarousel />
      <TermContainer />
    </div>
  )
}
