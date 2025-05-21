import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import AppRoutes from "./routes/index";

const App = () => (
  <AuthProvider>
    <EventProvider>
      <Router>
        <AppRoutes />
      </Router>
    </EventProvider>
  </AuthProvider>
);

export default App;
