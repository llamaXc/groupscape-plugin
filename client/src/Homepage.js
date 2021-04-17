import {React, Component} from "react";
import "./Components/MonsterDrop.css"
import {useState} from "react";
import SharedLootLogger from "./Components/SharedLootLogger.js";
import {formatToRuneScapeGp} from "./Utils/runescapeUtil.js"

function Homepage(props) {

    var [panel, setPanel] = useState("NONE");

    function renderMainPanel(){
      if(panel == "NONE" || panel == "DROPS"){
        return   <SharedLootLogger drops={props.drops}/>
      }else if(panel == "CHALLENGES"){
        return <h1>TESTING</h1>
      }
    }

    function renderPlayerList(){
      console.log(props.players)
      return <div>
        <h1>Players</h1>
        <ul className="player-list">
          {
          props.players && props.players.map((player, index)=>{
            if(player.loggedInState == true){
              return <li>{player.name}</li>
            }
          })
          }
        </ul>
      </div>
    }

    function renderPanelList(){
      return  <div>
        <h1>Panels</h1>
        <ul className="player-list">
          <li onClick={() => setPanel("DROPS")}>Loot Logger</li>
          <li onClick={() => setPanel("CHALLENGES")}>Challenges</li>
          <li>Inventory</li>
        </ul>
      </div>
    }

    function renderStats(){
      console.log(props.room)
      if(props.room._id ){
        console.log("SHOW STAT")
        return <div>
        <p> {props.room.roomName}</p>
        <p>Profits <span style={{"color" : "green"}}> {formatToRuneScapeGp(props.gp)} </span></p>
        </div>
      }else{
        return <div><p>Join a room!</p></div>
      }
    }

    return(
      <center>

      <div className="tri-column">

        <div className="left-sidebar">
          {renderStats()}
          {renderPanelList()}
          {renderPlayerList()}
        </div>

        <div className="main-panel">
          {renderMainPanel()}
        </div>

        <div className="right-sidebar">

        </div>
      </div>

      </center>
    );
    
}

export default Homepage;
