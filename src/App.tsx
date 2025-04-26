import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import AppRoutes from "./routes/index";

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
