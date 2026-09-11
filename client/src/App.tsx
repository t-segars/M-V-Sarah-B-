import { Switch, Route } from "wouter";
import AdminPage from "./pages/Admin";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
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