import React, { Component } from 'react';
import { IBuilder } from '../../modals/IBuilder';
import * as _ from "lodash";
interface FieldState {
  
 }

 interface FieldProps {
    builder:IBuilder
    fieldType:string
    onChangeHandler(name: string,value: string): void

}
class Field extends Component<FieldProps,FieldState> {
    constructor(props:any) {
        super(props);
        this.state = { 
        }
    }
    onChangeHandler = (e:any)=>{
        this.props.onChangeHandler(e.target.name,e.target.value)
    }
   
    render() {
        const {builder, fieldType}=this.props

         return (
        <div  className="row">
            <div className="col-sm-1 form-lb">{fieldType}</div>
            <div className="col-sm-4"><input className="form-control form-control-sm" type="text" value={_.get(builder,fieldType+".value","")} name={fieldType+".value"} onChange={this.onChangeHandler} ></input></div>
              
        </div>)
    }
}

export default Field;
