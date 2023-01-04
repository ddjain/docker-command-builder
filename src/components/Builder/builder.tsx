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
        let builder = this.createEmptyBuilder()
        let localBuilder = localStorage.getItem("builder");
        if(localBuilder) {
          builder  = JSON.parse(localBuilder) as IBuilder
        }
        this.state = {
            command:"",
             builder: builder
        }
    }

createEmptyBuilder = ()=>{
  return {
      image: {id:uuidv4(),key:"",value:""} as IPair,
      container: {id:uuidv4(),key:"",value:""} as IPair,
      network:{id:uuidv4(),key:"",value:""} as IPair,
      ports: [{id:uuidv4(),key:"",value:""} as IPair] as IPair[],
      volumes:[{id:uuidv4(),key:"",value:""} as IPair] as IPair[],
      enviornments:[{id:uuidv4(),key:"",value:""} as IPair] as IPair[],
 } as IBuilder
}
    componentDidMount(){
        this.mixpanelInit()
    }

    mixpanelInit =()=>{
        let userId=localStorage.getItem("userId")
        let mixpanel= (window as any).mixpanel;
        debugger
        if(userId==null){
            userId=uuidv4()
            localStorage.setItem("userId",userId)
        }
        mixpanel.identify(userId);
        mixpanel.people.set({ "count": 0 });
        mixpanel.people.increment("count", 1);
        mixpanel.track(
            "App Launched",
            {}
        );
    }
    onChangeHandler = (name:string,value:string)=>{
        let {builder}=this.state  
        _.set(builder, name, value)
        this.setState({builder:builder},()=>{
            this.getDockerBuildCommand()
        })

    }
    addFieldHandler = (type:string)=>{

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

      reset=()=>{
        let builder = this.createEmptyBuilder()
        this.setState( {builder: builder})
        localStorage.removeItem("builder")
      }

      getDockerBuildCommand=()=>{
        let {builder}=this.state
        localStorage.setItem("builder",JSON.stringify(builder))


        let command="docker run"
        if(builder.container.value!==""){
            command = command + " --name " + builder.container.value
        }

        if(builder.network.value!==""){
            command = command + " --network " + builder.network.value
        }

        if(builder.ports.length>0){
            for(let i=0;i<builder.ports.length;i++){
                if(builder.ports[i].key!=="" && builder.ports[i].value!=="")
                    command = command + " -p \"" + builder.ports[i].key + "\":\"" +  builder.ports[i].value +"\""
            }
        }

        if(builder.enviornments.length>0){
            for(let i=0;i<builder.enviornments.length;i++){
                if(builder.enviornments[i].key!=="" && builder.enviornments[i].value!=="")
                    command = command + " -e \"" + builder.enviornments[i].key + "\"=\"" +  builder.enviornments[i].value +"\""
            }
        }

        if(builder.volumes.length>0){
            for(let i=0;i<builder.volumes.length;i++){
                if(builder.volumes[i].key!=="" && builder.volumes[i].value!=="")
                    command = command + " -v \"" + builder.volumes[i].key + "\":\"" +  builder.volumes[i].value +"\""
            }
        }

        if(builder.image.value!==""){
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
                <Field placeholder="ex: nginx" builder={builder} fieldType="image" onChangeHandler={this.onChangeHandler}></Field>
                <br/>
                <Field placeholder="ex: webapp" builder={builder} fieldType="container" onChangeHandler={this.onChangeHandler}></Field>
                 <br/>
                <Field placeholder="ex: bridge or host" builder={builder} fieldType="network" onChangeHandler={this.onChangeHandler}></Field>

                <br/>
                <MultiField builder={builder} fieldType="ports" onChangeHandler={this.onChangeHandler} removeFieldHandler={this.removeFieldHandler} addFieldHandler={this.addFieldHandler}></MultiField>
                    
                <br/>
                
                <MultiField builder={builder} fieldType="volumes" onChangeHandler={this.onChangeHandler} removeFieldHandler={this.removeFieldHandler} addFieldHandler={this.addFieldHandler}></MultiField>
                <br/>
                <MultiField builder={builder} fieldType="enviornments" onChangeHandler={this.onChangeHandler} removeFieldHandler={this.removeFieldHandler} addFieldHandler={this.addFieldHandler}></MultiField>
                <br/>

                <div className="row">
                    <div className="col-sm-3">
                         <button type="button" onClick={this.getDockerBuildCommand} className="btn btn-success">Generate</button>
                    </div>
                    <div className="col-sm-3">
                         <button type="button" onClick={this.reset} className="btn btn-success">Reset</button>
                    </div>
                    <div className="col-sm-6">
                    </div>
                </div>
                <div className="row">
                    {command!==""?  command:""}
                    {/* <div className="col-sm-12 ">

                    <div className="tooltip">{command!==""?  command:""}
                        <span className="tooltiptext">Click to copy</span>
                    </div>

                        <p className="tooltip Tooltip Text"></p>
                    </div> */}
                </div>

            </div>
          
           
         </div>)
    }
}

export default Builder;
