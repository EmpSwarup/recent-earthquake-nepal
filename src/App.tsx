import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Map from "./components/Map";

function App() {
  return (
    <div className="container mx-auto px-2 md:px-4 py-2 md:py-4 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Map />
      </main>
      <Footer />
    </div>
  );
}

export default App;
