import { Switch, Route } from "wouter";
import AdminPage from "./pages/Admin";
import Home from "./pages/Home";
import HVACPage from "./pages/HVAC"; // 1. Import the new page

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      {/* 2. Add the route so users can visit /hvac */}
      <Route path="/hvac" component={HVACPage} /> 
      <Route>404 - Not Found</Route>
    </Switch>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App;