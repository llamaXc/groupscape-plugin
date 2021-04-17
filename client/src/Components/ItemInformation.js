import {React, Component} from "react";
import "./MonsterDrop.css"
import {formatToRuneScapeGp} from "../Utils/runescapeUtil.js"

export default class ItemInformation extends Component {

    render(){

        //what color should text be?
        var total = this.props.item.value * this.props.item.quantity
        var color = "#ebd24a"
        if(total > 99999 && total < 10000000){
            color = "white"
        }else if(total > 10000000){
            color = "green"
        }

        return(
            <div className="itemInfoFlexbox">

                <div className="itemIcon">
                    {this.props.item.icon ? <img src={`data:image/png;base64,${this.props.item.icon }`}/>: ''}
                </div>

                
                <div className="itemInfo">
                    <p className="runescape-gold-color">{this.props.item.name} <span style={{"color": color}} >{formatToRuneScapeGp(this.props.item.value * this.props.item.quantity)}</span> </p>
                </div>
            </div>
        );
    }
}
