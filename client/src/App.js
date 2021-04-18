import './App.css';
import Navbar from './Navbar.js';
import Homepage from './Homepage.js';
import Login from './Login.js';
import Account from './Account.js';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {React, Component} from "react";
import {getAccount, logout} from "./AccountUtil"
import Register from "./Register.js"
import io from "socket.io-client";
import axios from 'axios';

export default class App extends Component {

  state = {
    socket: {},
    account: {
      isLoggedIn: false,
      username: "guest",
      jwt: "",
      osrsName: "",
      currentRoomId: ""
    },
    
    room : {},
    activePlayers : [],
    drops: [],
    gpEarned: 0,
  };


  componentDidMount(){
    console.log("MOUNTING THE APP");
    this.setupSocket();
  }

  async setupSocket(){
    console.log("CREATING NEW SOCKET FOR NEW USER");

    var socket  = io({account: this.state.account});

    socket.on("process-drop", function(drop){
      console.log("NEW DROP INBOUND")
      this.addDrop(drop.player, drop.monster, drop.items)
    }.bind(this))

    socket.on("player-list", function(players){
      console.log("====== GOt players =====")
      console.log((players))
      this.setState({activePlayers: players})
    }.bind(this))

    socket.on("client-connected", function(room, validJoin){
      console.log(room)
      console.log(validJoin)
      if(validJoin){
        this.setState({room: room})
      }
    }.bind(this))

    this.setState({socket: socket})
  }

  handleRoomCreation = async (newName) =>{
      
    await axios.post("/create-room", {roomName: newName, owner: this.state.account.name, ownerId: this.state.account.accountId}, {headers: {authorization: this.state.account.jwt}}).then(function(res){
        console.log(res.data);
        if(res.data.success){
          this.setState({room: res.data.room})
          var account = this.state.account;
          account.currentRoomId = res.data.room._id;
          this.setState({account: account});
        }
        alert(res.data.msg);

    }.bind(this)).catch(function(err){
      alert("Not authorized to create this room");
    })
  }

  handleChangeRoom = async (newId) => {
    console.log(this.state.account)

    if(this.state.account){

      await axios.post("/change-room", 
      {desiredRoomId: newId}, 
      {headers: {authorization: this.state.account.jwt}}).then( function(res){
        if(res.data.success == true){
          console.log("Updating id")
          var account = this.state.account;
          account.currentRoomId = newId;
          
          this.setState({account: account});
          this.setState({room: res.data.room});
        }else{
          alert("Invalid room id!");
        }
      }.bind(this));

    }
  }

  handleLogout = async () =>{
    logout();
    
    await this.state.socket.emit('end');
    this.setState({socket: {}})
    this.setState({account: {}})
    this.setState({room: {}})
    this.setState({drops: []})
  }

  handleLogin = async (username, password, accountId, jwt, roomId) => {
    var account = this.state.account;
    account.isLoggedIn = true;
    account.username = username;
    account.accountId = accountId;
    account.jwt = jwt;
    account.currentRoomId = roomId
    this.setState({account: account})

    //is our socket null? lets make a new one! 
    console.log(this.state.socket)
    if(this.state.socket == {} ||  this.state.socket == null || this.state.socket.id == null){
      console.log("SOCKET WAS NULL")
      await this.setupSocket();
    }

    this.state.socket.emit("logged-in", account)

    //emit to let them know our currenct socket! 
  }


  //Backend logic for adding a new drop to the room 
  addDrop = async(player, monster, items)=> {

    var currentDrops = this.state.drops;
    var lastDrop = currentDrops[0]

    var dropId = lastDrop != null ? lastDrop.id + 1 : 1
    var i = 0;

    //Get the icons for all items 
    for( i =0; i < items.length; i++){
      var data = await axios.get("https://api.osrsbox.com/items?where={\"name\": \"" + items[i].name +"\" }").then((result) => {
        items[i].icon = result.data._items[0].icon;
      }); 
    }

    //Prepare the drop object 
    var drop = { 
      id: dropId,
      player: player,
      monster: monster, 
      items: items,
      worth: 0
    } 

    //Find out cost of the drop 
    var worth = 0 
    items.forEach(function(item){
      worth += item.value * item.quantity;
    })
    drop.worth = worth;

    //Insert into 0th index 
    currentDrops.splice(0,0,drop);

    //Remove old elements from array?
    currentDrops.splice(50)

    //Update state to re render 
    this.setState({gpEarned: this.state.gpEarned + worth});
    this.setState({drops: currentDrops});
  }

  //Different Pages in the App 
  render() {
    return ( 
      <BrowserRouter>
        <div className="App">  
        {this.state.account && <Navbar logout={this.handleLogout} accountState={this.state.account}/>}
          <Switch>
            <Route path="/register" render={() => <Register loginCallback={this.handleLogin}/>} exact />
            <Route path="/login"    render={() => <Login    loginCallback={this.handleLogin}/>} exact />
            <Route path="/account" render={() =>  <Account  createRoomCallback={this.handleRoomCreation} changeRoomCallback={this.handleChangeRoom} account={this.state.account} room={this.state.room} gp={this.state.gpEarned} drops={this.state.drops} addDrop={this.addDrop}/> } exact />
            <Route path="/homepage" render={() => <Homepage players={this.state.activePlayers} room={this.state.room} gp={this.state.gpEarned} drops={this.state.drops} addDrop={this.addDrop}/> } exact />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }

}


