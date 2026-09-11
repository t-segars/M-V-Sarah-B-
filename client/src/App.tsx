import { Switch, Route } from "wouter";
import AdminPage from "./pages/Admin";
import Home from "./pages/Home";
import HVACPage from "./pages/HVAC";

function Router() {
  return (
    <Switch>
      {/* The public home dashboard */}
      <Route path="/" component={Home} />
      
      {/* The private admin portal */}
      <Route path="/admin" component={AdminPage} />
      
      {/* The public HVAC page */}
      <Route path="/hvac" component={HVACPage} />
      
      <Route>404 - Not Found</Route>
    </Switch>
  );
}

export default function App() {
  return <Router />;
}