import React from "react";

import {memo} from "react";

import { FormGroup, InputGroup, HTMLSelect } from "@blueprintjs/core";

import {PoolAddressSelector} from "./pool_tree";

export {AccountTextField, AccountSelectField, AccountAddressSelectField}

function AccountTextField(props){
    return (
        <FormGroup key={props.name}
                      inline={false}
                      style={{padding: 5}}
                      label={props.display_text}
                      helperText={props.helper_text}>
                        <InputGroup type="text"
                                       onChange={(event)=>props.onFieldChange(props.name, event.target.value, false)}
                                       onBlur={()=>props.onBlur(props.name, props.value)}
                                       style={{width: 250}}
                                       large={false}
                                       fill={false}
                                       placeholder={props.name}
                                       value={props.value}
                                       />
            </FormGroup>
    )
}

AccountTextField = memo(AccountTextField);

function AccountSelectField(props) {
    props = {
        inline: false,
        ...props
    };
    return (
        <FormGroup key={props.name}
                   inline={props.inline}
                   style={{padding: 5}}
                   label={props.display_text}
                   helperText={props.helper_text}>
            <HTMLSelect options={props.options}
                        onChange={(e)=>{props.onFieldChange(props.name, e.currentTarget.value, true)}}
                        value={props.value}/>
        </FormGroup>
    )
}

AccountSelectField = memo(AccountSelectField);

function AccountAddressSelectField(props) {
    props = {
        tsocket: null,
        ...props
    }
    return (
        <FormGroup key={props.name}
                   inline={false}
                   style={{padding: 5}}
                   label={props.display_text}
                   helperText={props.helper_text}>
            <PoolAddressSelector value={props.value}
                                 tsocket={props.tsocket}
                                 select_type="folder"
                                 setValue={(newVal)=>{props.onFieldChange(props.name, newVal, true)}}/>
        </FormGroup>
    )
}

AccountAddressSelectField = memo(AccountAddressSelectField);