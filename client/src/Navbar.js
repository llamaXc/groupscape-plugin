import {React, Component, createRef} from "react";
import {Link} from "react-router-dom";

export default class Navbar extends Component {

    constructor(props){
        super(props);
    }


    renderUser(){
        if(this.props.accountState.isLoggedIn){
            return <p>User: {this.props.accountState.username}</p>
        }
    }

    renderAccount(){
        if(this.props.accountState.isLoggedIn){
            return <Link to="/account">Account</Link>
        }
    }
    
    renderLogin(){
        if(this.props.accountState.isLoggedIn){
            return <Link onClick={() =>  this.props.logout()}to="/login">Logout</Link>
        }else{
            return <Link to="/login">Login</Link>
        }
    }
    //What is drawn when we display a nav bar
    render(){
        return (
            <div>
            <nav className="navbar">
                <h1>OSRSEvents</h1>
                <div className="links">
                    <Link to="/">Home</Link>
                    {this.props.accountState && this.renderAccount()}

                    {this.props.accountState && this.renderLogin()}
                    {this.props.accountState && this.renderUser()}
                </div>
            </nav>
            </div>
        );
    }
}

