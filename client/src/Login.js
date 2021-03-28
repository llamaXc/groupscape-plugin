import {React, Component} from "react";
import {Button, Container, TextField} from '@material-ui/core';
import './Login.css';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class Login extends Component {
    state = {fireRedirect: false};


    login = () => {
        axios.post(`/api/login`, {username: "preston", password: "root"})
        .then(res => {
          const data = res.data;
          if(data.success){
              this.setState({fireRedirect: true});
          }
        })
    }

    render(){
        return(
            <Container className="login" width={1/2}>
                {this.state.fireRedirect && <Redirect to='/' push={true} />}

                <form>
                <h1>Login Page</h1>
                <TextField id="username" label="Username" />
                <TextField id="password" type="password" label="Password" />
                <br/>
                <Button onClick={this.login}id="login-button" variant="contained">Login</Button>
                <Button id="login-button">Register</Button>
                </form>

            </Container>
        );
    }
}
