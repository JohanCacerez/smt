import "bootstrap/dist/css/bootstrap.min.css";
import { Navigation } from "./components/Navigation";
import { Home } from "./pages/Home";

function App() {
  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <Navigation />

      {/* Contenido principal */}
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;
