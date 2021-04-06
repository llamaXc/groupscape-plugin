import {React, Component} from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import io from "socket.io-client";
import {getAccount} from "./AccountUtil";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

export default class Homepage extends Component {

    state = {redirectToLogin: false, socket: {}}

    componentDidMount = async() => {
        //TODO use the actual player id 
        await this.setState({ socket : io({query: {playerId: getAccount().token}}) });
        
        console.log(getAccount().username);
        var account = getAccount();
        console.log(account);

        if(account == false || account.isLoggedIn == false){
            this.setState({redirectToLogin: true})
        }

        this.state.socket.on("process-drop", data => {
          this.setState({latestDrop: data.drop});
          this.setState({gottenDrop: true});
          console.log(data)
        });
      }

    state = {
        message: "Loading...",
    };
    
    renderDrop(){
        if(this.state.gottenDrop == true){
          return(<div>
                {this.state.redirectToLogin && <Redirect to="/login"/>}
                <h1>Monster: {this.state.latestDrop.name}</h1>
                <h1>Level: {this.state.latestDrop.level}</h1>
                {this.state.latestDrop.lootItems.map((drop, index) => (
                  <div>
                    <h3>Item Name: {drop.name}</h3>
                    <p>GP Value: {drop.value}</p>
                    <p>Quantity: {drop.quantity}</p>
                  </div>
                ))}
                </div>)
        }else{
          return <h1>No Drops</h1>
        }
    }

    render(){
        return(
            <div>
                {this.state.redirectToLogin && <Redirect to="/login"/>}
                {this.renderDrop()}
            </div>
        );
    }
}
