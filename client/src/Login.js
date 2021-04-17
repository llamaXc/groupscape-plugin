import {React, Component} from "react";
import {Button, Container, TextField} from '@material-ui/core';
import './Login.css';
import {login} from "./AccountUtil"
import { BrowserRouter, Link, Route, Redirect } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default class Login extends Component {

    state = {
        redirectToHomepage : false,
        username: "",
        password: "",
    }

    handleLogin = () =>{
        axios.post(`/login-webapp`, {username: this.state.username, password: this.state.password})
        .then(res => {
            console.log(res);
            if(res.data.success == true){
                login(this.state.username, this.state.password, res.data.accountId, res.data.token, res.data.roomId);
                this.props.loginCallback(this.state.username, this.state.password, res.data.accountId, res.data.token, res.data.roomId);
                this.setState({redirectToHomepage: true});
            }else{
                alert("Bad Login, try again");
            }
        })
    }

    updateUsername = (e) =>{
        console.log(e.target);
        this.setState({username: e.target.value});
    }

    updatePassword = (e) =>{
        this.setState({ password: e.target.value});
    }

    handleRegister(){
        this.setState({redirectToRegister: true})
    }

    render(){
        return(
            <Container className="login" width={1/2}>
                {this.state.redirectToRegister && <Redirect to="/register"/>}
                {this.state.redirectToHomepage && <Redirect to="/homepage"/>}
                <h1>Login Page</h1>
                <TextField onChange={this.updateUsername.bind(this)} id="s" label="Username" />
                <br/>
                <TextField onChange={this.updatePassword.bind(this)}  id="standard-basic" type="password" label="Password" />
                <br/>
                <Button onClick={() => this.handleLogin()} id="login-button" variant="contained">Login</Button>
                <Button onClick={() => this.handleRegister()} id="login-button">Register</Button>

            </Container>
        );
    }
}
