import { useState } from "react";
import "./App.css";
import MovieList from "./MovieList";

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Tabitha&apos;s Flixster</h1>
      </header>
      <main>
        <MovieList />
      </main>
      <footer className="site-footer">
        <p>Tabitha&apos;s Flixster Fancy Footer</p>
      </footer>
    </div>
  );
};

export default App;
