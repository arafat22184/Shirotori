import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <div className="min-h-svh">
      <header>
        <Navbar></Navbar>
      </header>
      <main className="max-w-7xl mx-auto px-5 xl:px-0 min-h-[calc(100vh-120px)]">
        <Home></Home>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
