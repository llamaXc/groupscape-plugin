import {React, Component} from "react";
import {Button, Container, TextField} from '@material-ui/core';
import './Login.css';
import {login} from "./AccountUtil"
import { Redirect } from "react-router-dom";
import axios from 'axios';

export default class Register extends Component {

    state = {
        redirectToHomepage : false,
        username: "",
        password: "",
    }

    handleRegister = async () =>{
        if(this.state.password == this.state.verifyPass){
            await axios.post(`/register`, {username: this.state.username, password: this.state.password})
            .then(res => {
                if(res.data.success == true){
                    login(this.state.username, this.state.password, res.data.accountId, res.data.jwtToken);
                    this.props.loginCallback(this.state.username, this.state.password, res.data.accountId, res.data.jwtToken);
                    this.setState({redirectToHomepage: true});
                }else{
                    alert(res.data.msg);
                }
            }).catch(function(error){
                console.log(error)
            });
        }
    }

    updateUsername = (e) =>{
        console.log(e.target);
        this.setState({username: e.target.value});
    }

    updatePassword = (e) =>{
        this.setState({ password: e.target.value});
    }   

    updateVerifyPassword = (e) =>{
        this.setState({verifyPass: e.target.value});
    }

    render(){
        return(
            <Container className="login" width={1/2}>
                {this.state.redirectToHomepage && <Redirect to="/homepage"/>}
                <h1>Register Page</h1>
                <TextField onChange={this.updateUsername.bind(this)} label="Username" />
                <br/>
                <br/>

                <TextField onChange={this.updatePassword.bind(this)}   type="password" label="Password" />
                <br/>
                <br/>
                <TextField onChange={this.updateVerifyPassword.bind(this)}  type="password" label="Verify Password" />
                <br/>
                <br/>
                <Button onClick={() => this.handleRegister()} variant="contained" id="login-button">Submit</Button>

            </Container>
        );
    }
}
