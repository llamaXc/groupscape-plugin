import {React, Component} from "react";
import {Link} from "react-router-dom";
export default class Navbar extends Component {
    
    //What is drawn when we display a nav bar
    render(){
        return (
            <div>
            <nav className="navbar">
                <h1 >Mountian-Top</h1>
                <div className="links">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                </div>
            </nav>
            </div>
        );
    }
}

