import {React, Component} from "react";
import "./Components/MonsterDrop.css"
import {useState} from "react";
import axios from "axios";
import { Redirect } from "react-router";

class Account extends Component {

  state = {roomEdited: false, newRoomName: "", setId: false, rooms: []} 

  updateRoomIdValue = (e) =>{
    console.log("Updating room id!"  + e.target.value);
    this.setState({desiredRoomId: e.target.value});
    this.setState({roomEdited: true})
  }

  updateNewRoomName = (e) =>{
    console.log("Updating new room!"  + e.target.value);
    this.setState({newRoomName: e.target.value});
  }

  componentDidMount(){
    console.log("setting desired room id: to " + this.props.account.currentRoomId)
    this.setState({desiredRoomId: this.props.account.currentRoomId})
  }

  deleteRoom(room){
    alert("Deleting id: " + room._id);
  }

  renderRooms(){
    if(this.state.rooms.length == 0){
      return <di><h4>No Rooms Found, make on now!</h4></di>
    }else{
      return <div>
          <h3>Your Rooms!</h3>
            {this.state.rooms && this.state.rooms.map(function(room, index){
              return <p key={index}>{room.roomName} : {room._id} <button onClick={() => this.deleteRoom(room)}>X</button></p>
            }.bind(this))}
      </div>
    }
  }

  renderRoomOptions(){
    console.log(this.state.desiredRoomId + " DESIRED ROOM ID FOR RENDER OPTOINS")
    if(this.props.room){
      return <div>
        <label>Current Room Id </label>
        <input onChange={this.updateRoomIdValue.bind(this)} value={this.state.desiredRoomId}/>
        <button enabled={this.state.roomEdited} onClick={() => this.changeRoom()}>Change Room Id</button>
      </div>
    }else{
      return <div>
      <p>Join a room today! </p>
    </div>
    }
  }

  componentDidMount = async() =>{
    this.loadRooms();
  }

  loadRooms = async() =>{
    console.log("CHECKING!");
    console.log(this.props.account)
    var results = await axios.post("/my-rooms",
     {accountId: this.props.account.accountId},
     {headers: {authorization: this.props.account.jwt}}).then(function (res){
        console.log(res.data)
        this.setState({rooms: res.data.rooms})
      }.bind(this));
  }

  createRoom = async() => {
    console.log("OIK TIME TO MAKE A NEW ROOM! " + this.state.newRoomName)

    console.log(this.props.account)
    this.props.createRoomCallback(this.state.newRoomName);
    this.loadRooms();
  } 

  renderMakeRoom(){
    return <div>
      <h1>Make a new room!</h1>
      <label>Room Name</label>
      <input onChange={this.updateNewRoomName.bind(this)}></input>
      <button onClick={() => this.createRoom()}>Create</button>
    </div>
  }

  changeRoom(){
    console.log("Request to leave room")    
    this.props.changeRoomCallback(this.state.desiredRoomId);
  }
  
  ensureValid(){
    console.log(this.props.account);
    console.log(this.props.room)
    if(this.state.setId == false){
      this.setState({desiredRoomId: this.props.account.currentRoomId});
      this.setState({setId: true});
    }
    if(this.props.account.isLoggedIn == false){
      return <Redirect to="/login"/>;
    }
  }

  render(){
    console.log("Re render")
    console.log(this.props.account)
    console.log(this.props.room)

    return(
      <center>
        {this.ensureValid()}
        <div>
            <p>Account Name: {this.props.account && this.props.account.username}</p>
            <p>Runelite Token: {this.props.account && this.props.account.accountId}</p>
            {this.props.account && this.renderRoomOptions()}
            {this.renderMakeRoom()}
            {this.renderRooms()}

        </div>

      </center>
    );
  }
}

export default Account;
