import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import MovieList from "./MovieList";

const App = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <MovieList />
      </main>
      <Footer />
    </div>
  );
};

export default App;
