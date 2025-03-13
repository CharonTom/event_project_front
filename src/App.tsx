import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Account from "./pages/Account";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/details" element={<Details />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<div>404 - Page non trouvée</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
