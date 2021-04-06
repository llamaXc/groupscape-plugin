import './App.css';
import Navbar from './Navbar.js';
import Homepage from './Homepage.js';
import Login from './Login.js';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {React, Component} from "react";
import {getAccount, logout} from "./AccountUtil"
import AccountSetting from "./AccountSetting.js"

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      account: {
        isLoggedIn: false,
        username: "guest",
        token: "",
        password: "",
        osrsName: "",
      }
    };
  }



  componentDidMount() {
    //see if we have logged in before?
    var account = getAccount();
    var reactSide = {};

    if(account.isLoggedIn == true){
      console.log("logged in");
      reactSide.isLoggedIn = true;
      reactSide.username = account.username;
      reactSide.token = account.token;
    }else{
      console.log("No user found")
      reactSide.isLoggedIn = false;
      reactSide.username = "";
      reactSide.token = "";
    }

    this.setState({account : reactSide});
  }

  updateAccount  = () =>{
    //todo
  }

  handleLogout = () =>{
    //call logout api
    logout();
    this.setState({account: {isLoggedIn: false, username:"", token: ""}})
  }

  handleLogin = async (username, password, token) => {
    var account = this.state.account;
    account.isLoggedIn = true;
    account.username = username;
    account.token = token;
    await this.setState({account: account});
    this.forceUpdate();
    console.log("calling login function! " + username )
  }

  //Different Pages in the App 
  render() {
    return ( 
      <BrowserRouter>
        <div className="App">      
        {this.state.account && <Navbar logout={this.handleLogout} accountState={this.state.account}/>}
          <Switch>
            <Route path="/login" render={() => <Login loginCallback={this.handleLogin}/>} exact />
            <Route path="/homepage" render={() => <Homepage/> } exact />
            <Route path="/account" render={() => <AccountSetting accountState={this.state.account}/> } exact />
            <Redirect to="/homepage" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}


