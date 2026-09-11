import { Switch, Route } from "wouter";
import AdminPage from "./pages/Admin";
import Home from "./pages/Home";
import HVACPage from "./pages/HVAC";
import PlumbingPage from "./pages/Plumbing";
import AncillaryPage from "./pages/Ancillary";
import DrawingsPage from "./pages/Drawings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/hvac" component={HVACPage} />
      <Route path="/plumbing" component={PlumbingPage} />
      <Route path="/ancillary" component={AncillaryPage} />
      <Route path="/drawings" component={DrawingsPage} />
      <Route>404 - Not Found</Route>
    </Switch>
  );
}

export default function App() {
  return <Router />;
}