import {React, Component} from "react";
import "./MonsterDrop.css"
import MonsterDrop from "./MonsterDrop.js"

export default class SharedLootLogger extends Component {

    renderDrops(){
        if(this.props.drops.length > 0){
            return (this.props.drops.map((drop, index)=>{
                return <MonsterDrop key={drop.id} mainClass="drop-container fadeIn" drop={drop} index={index} isLast={0  == index}/>
            }))
        }else{
            return <div><h3>No loot found! Go kill something!</h3></div>
        }
    }
  
    render(){
        return <div className="loot-logger">
            <h1>Shared Loot Logger</h1>
            {this.props.drops && this.renderDrops()}
        </div>
    }
}
