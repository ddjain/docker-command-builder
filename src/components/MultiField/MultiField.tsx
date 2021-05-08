import React, { Component } from 'react';
import { IBuilder } from '../../modals/IBuilder';
import { IPair } from '../../modals/IPair';

import * as _ from "lodash";
 interface MultiFieldState {
  
 }

interface MultiFieldProps {
    builder:IBuilder
    fieldType:string
    addFieldHandler(type: string): void,
    removeFieldHandler(type:string, field:IPair): void,
    onChangeHandler(name: string,value: string): void,

    
}
class MultiField extends Component<MultiFieldProps,MultiFieldState> {
    constructor(props:any) {
        super(props);
        this.state = {
              
        }
    }
    onChangeHandler = (e:any)=>{
         
        this.props.onChangeHandler(e.target.name,e.target.value)
         
    }
    addFieldHandler = (type:string)=>{
        this.props.addFieldHandler(type)
    

    }

    removeFieldHandler = (type:string, field:IPair)=>{
       this.props.removeFieldHandler(type,field)
       
      }

     
    
    render() {
        const {builder, fieldType}=this.props
        let placeholderHost=fieldType!=="enviornments"?"Host":"Key"
        let placeholderContainer=fieldType!=="enviornments"?"Container":"Value"
        
         return (
            <div>
                <div className="mg-top-2 row">
                    <div className="col-sm-2 form-lb"> 
                        {fieldType}
                    </div>
                    <div className="col-sm-4">
                        <button type="button" onClick={()=>this.addFieldHandler(fieldType)} className="btn btn-primary btn-sm">
                            +
                        </button>

                     </div>
                 </div>

                 
             
              {_.get(builder,fieldType,[]).map((field:IPair,index:number)=>{
                return(
                    <div key={field.id} className="mg-top-5 row">
                        {/* <div className="col-sm-"> 
                        </div> */}
                        <div className="col-sm-2"> 
                            <input  placeholder={placeholderHost} type="text" className="form-control form-control-sm" value={field.key} name={fieldType+"["+index+"].key"} onChange={this.onChangeHandler} ></input>
                        </div>
                        <div className="col-sm-2"> 
                            <input placeholder={placeholderContainer} type="text" className="form-control form-control-sm" value={field.value} name={fieldType+"["+index+"].value"} onChange={this.onChangeHandler} ></input>
                        </div>
                        <div className="col-sm-2"> 
                            <button type="button" onClick={()=>this.removeFieldHandler(fieldType,field)} className="btn btn-danger btn-sm">
                                -
                            </button>
                         </div>
                    </div>
 
                )
            })}
            <hr className="mt-2 mb-2"></hr>
        </div>
    )
    }
}

export default MultiField;
