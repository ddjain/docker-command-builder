import React, { Component } from 'react';
import { IBuilder } from '../../modals/IBuilder';
import { IPair } from '../../modals/IPair';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import MultiField from '../MultiField/MultiField';
import Field  from "../Field/Field"
interface BuilderState {
    builder:IBuilder,
    command:string
}

interface BuilderProps {
}
class Builder extends Component<BuilderProps,BuilderState> {
    constructor(props:any) {
        super(props);
        this.state = {
            command:"",
             builder: {
                 image: {id:uuidv4(),key:"",value:""} as IPair,
                 container: {id:uuidv4(),key:"",value:""} as IPair,
                 network:{id:uuidv4(),key:"",value:""} as IPair,
                 ports: [] as IPair[],
                 volumes:[] as IPair[],
                 enviornments:[] as IPair[],
            } as IBuilder
        }
    }
    onChangeHandler = (name:string,value:string)=>{
        debugger
        let {builder}=this.state  
        _.set(builder, name, value)
        this.setState({builder:builder},()=>{
            this.getDockerBuildCommand()
        })

    }
    addFieldHandler = (type:string)=>{
      debugger
      let {builder}=this.state
      let fields=_.get(builder,type)
      fields.push({id:uuidv4(),key:"",value:""} as IPair)
      _.set(builder, type, fields)
      this.setState({builder:builder})
    }

    removeFieldHandler = (type:string, field:IPair)=>{
        debugger
        let {builder}=this.state
        let fields=_.get(builder,type)
        _.remove(fields, {
            id: field.id
        });
        _.set(builder, type, fields)
        this.setState({builder:builder})
      }

      getDockerBuildCommand=()=>{
          debugger
        let {builder}=this.state
        let command="docker run"
        if(builder.container.value!==""){
            command = command + " --name " + builder.container.value
        }

        if(builder.network.value!==""){
            command = command + " --network " + builder.network.value
        }
        if(builder.ports.length>0){
            for(let i=0;i<builder.ports.length;i++){
                command = command + " -p \"" + builder.ports[i].key + "\":\"" +  builder.ports[i].value +"\""
            }
        }

        if(builder.enviornments.length>0){
            for(let i=0;i<builder.enviornments.length;i++){
                command = command + " -e \"" + builder.enviornments[i].key + "\"=\"" +  builder.enviornments[i].value +"\""
            }
        }

        if(builder.volumes.length>0){
            for(let i=0;i<builder.volumes.length;i++){
                command = command + " -v \"" + builder.volumes[i].key + "\":\"" +  builder.volumes[i].value +"\""
            }
        }

        if(builder.container.value!==""){
            command = command + " " + builder.image.value
        }
        this.setState({command:command})        
      }
    
    render() {
        const {command,builder}=this.state  
        return (
        <div>
             
            <div className="container">
                <div className="row">
                    <div className="col-sm-5"></div>
                    <div className="col-sm"><h3>Docker Command Builder</h3></div>
                     
                </div>
                <Field builder={builder} fieldType="image" onChangeHandler={this.onChangeHandler}></Field>
                <br/>
                <Field builder={builder} fieldType="container" onChangeHandler={this.onChangeHandler}></Field>
                 <br/>
                <Field builder={builder} fieldType="network" onChangeHandler={this.onChangeHandler}></Field>

                <br/>
                <MultiField builder={builder} fieldType="ports" onChangeHandler={this.onChangeHandler} removeFieldHandler={this.removeFieldHandler} addFieldHandler={this.addFieldHandler}></MultiField>
                <br/>
                <MultiField builder={builder} fieldType="volumes" onChangeHandler={this.onChangeHandler} removeFieldHandler={this.removeFieldHandler} addFieldHandler={this.addFieldHandler}></MultiField>
                <br/>
                <MultiField builder={builder} fieldType="enviornments" onChangeHandler={this.onChangeHandler} removeFieldHandler={this.removeFieldHandler} addFieldHandler={this.addFieldHandler}></MultiField>
                <br/>

                <div className="row">
                    <div className="col-sm-6"> 
                         <button type="button" onClick={this.getDockerBuildCommand} className="btn btn-success">Generate</button>
                    </div>
                    <div className="col-sm-6"> 
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 ">

                    <div className="tooltip">{command!==""?  command:""}
                        <span className="tooltiptext">Click to copy</span>
                    </div>

                        <p className="tooltip Tooltip Text"></p>
                    </div>
                </div>

            </div>
          
           
         </div>)
    }
}

export default Builder;
