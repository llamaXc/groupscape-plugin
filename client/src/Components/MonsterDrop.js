import {React, Component} from "react";
import "./MonsterDrop.css"
import ItemInformation from "./ItemInformation.js"
import {formatToRuneScapeGp} from "../Utils/runescapeUtil.js"

export default class MonsterDrop extends Component {


    state = {
        classToUse: "drop-container",
        rendered: false
    };

    renderPlayerInfo(){
        return  <div className="player-info">
            {this.renderValueTag()}

            <p>{this.props.drop.monster.name}</p>
            <p>- {this.props.drop.player.name}</p>
        </div>
    }

    renderItems(){
        return<div className="monster-flex">{
            this.props.drop.items.map((item, index) =>{
                return <ItemInformation showBreak={index = this.props.drop.items.length - 1} item={item}/>
            })
        }</div>
    }

    setupFadeIn(){
        if(this.props.isLast && this.state.rendered == false){
            this.setState({rendered: true})
            console.log("top item is: " + this.props.drop.id);
            this.setState({classToUse: "drop-container fadeIn"})
            setTimeout(function(){this.setState({classToUse: "drop-container faddedIn"})}.bind(this), 100);
        }
    }

    renderValueTag(){
        var valueTagClass = "low"
        var worth = this.props.drop.worth 
        var textColorClass = "low"

        // < 100K, it is yellow with just price 
        // < 10M, it is white with K 
        // >10M, it is green with M 
        if(worth > 1000000){
            valueTagClass = "million-gp-color"
        }else if(worth > 100000){
            valueTagClass = "hundred-k-gp-color"
        }else if(worth > 50000){
            valueTagClass = "fifty-k-gp-color"
        }else if(worth > 10000){
            valueTagClass = "ten-k-gp-color"
        }else{
            valueTagClass = "cheap-gp-color"
        }
        return <p className={valueTagClass} id="dropNumber">{formatToRuneScapeGp(this.props.drop.worth)}</p>
    }

    render(){

        this.setupFadeIn();

        if(this.props.drop == null || this.props.drop.items == null){
            return <div  key={this.props.key}/>
        }else{
            return(
                <div key={this.props.key} className={this.state.classToUse}>
                        {this.renderPlayerInfo()}
                        {this.renderItems()}
                </div>
            );
        }
    }
}
