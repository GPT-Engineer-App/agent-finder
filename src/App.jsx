import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import YourApp from "./pages/YourApp.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/yourapp" element={<YourApp />} />
      </Routes>
    </Router>
  );
}

export default App;
