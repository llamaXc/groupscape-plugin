import {React, Component} from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';

export default class Homepage extends Component {

    state = {
        message: "Loading...",
    };
    
    componentDidMount() {
        axios.get("/api/hello").then((response) => {
            this.setState({ message: response.data.message });
        });
    }

    render(){

        return(
            <div>
                <h1>Home Page</h1>
                <p>{this.state.message}</p>
            </div>
        );
    }
}
