import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Layout from "./pages/Layout"; // Import the Layout component

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Index />} />
        </Routes>
    </Router>
  );
}

export default App;
