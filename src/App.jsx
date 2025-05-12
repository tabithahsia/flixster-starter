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
        <section id="about">
          <h2>About</h2>
          <p>Tabitha&apos;s Flixster is a movie exploration app.</p>
        </section>
        <section id="contact">
          <h2>Contact</h2>
          <p>
            Contact us at{" "}
            <a href="mailto:support@flixster.com">support@flixster.com</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
