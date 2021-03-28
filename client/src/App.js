import './App.css';
import Navbar from './Navbar.js';
import Homepage from './Homepage.js';
import Login from './Login.js';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

//Different Pages in the App 
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="App">
        <Switch>
          <Route path="/" component={Homepage} exact />
          <Route path="/login" component={Login} exact />
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  );
}


export default App;
