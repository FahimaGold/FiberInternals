
import React from "react";
export function MyButton(props){
    return <button onClick={props.onClick}>
    count is {props.count}
  </button>
}