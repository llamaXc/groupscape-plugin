import {React, Component} from "react";
import { Redirect } from "react-router-dom";

export default class AccountSetting extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        //is allowed on page?
        console.log(this.props.accountState)
    }

    isAllowedOnPage(){
        if(!this.props.accountState.isLoggedIn){
            return <Redirect to="/login"/>
        }
    }

    //What is drawn when we display a nav bar
    render(){
        return (
            <div>
                {this.props.accountState && this.isAllowedOnPage()}
                <p>Account Settings</p>
                <p>Account Name: {this.props.accountState.username}</p>
                <p>Account Token: {this.props.accountState.token}</p>
            </div>
        );
    }
}

