import {React, Component} from "react";
import {Button, Container, TextField} from '@material-ui/core';
import './Login.css';

export default class Login extends Component {

    render(){
        return(
            <Container className="login" width={1/2}>
                <h1>Login Page</h1>
                <TextField id="standard-basic" label="Username" />
                <TextField id="standard-basic" type="password" label="Password" />
                <br/>
                <Button id="login-button" variant="contained">Login</Button>
                <Button id="login-button">Register</Button>

            </Container>
        );
    }
}
