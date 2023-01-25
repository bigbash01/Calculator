import './App.css';
import React from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTION={
ADD_DIGIT: 'add-digit',
CHOOSE_OPERATION: 'choose-operation',
CLEAR: 'clear',
DELETE_DIGIT:'delete-digit',
EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  // eslint-disable-next-line default-case
  switch(type){
    case ACTION.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currValue: payload.digit,
          overwrite: false
        };
      }
      if(payload.digit==="." && state.currValue==null)return state
      if(payload.digit==="0" && state.currValue==="0"){
        return state;
      }
      if(payload.digit==="." && state.currValue.includes(".")){
        return state;
      }
      return {
        ...state,
        currValue: `${state.currValue || ""}${payload.digit}`
      };
    case ACTION.CHOOSE_OPERATION:
      if(state.currValue==null && state.prevValue==null){
        return state;
      }
      if(state.prevValue==null){
        return{
          ...state,
          operation: payload.operation,
          prevValue: state.currValue,
          currValue: null
        };
      }
      if(state.currValue==null){
        return{
          ...state,
          operation: payload.operation
        }
      }
      return{
        ...state,
        prevValue: Evaluate(state),
        operation: payload.operation,
        currValue: null,
      }
    case ACTION.CLEAR:
      return {};
    case ACTION.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currValue: null
        };
      }
      if(state.currValue == null)return state;
      if(state.currValue.length ===1 ){
        return{
          ...state,
          currValue: null
        };
      }
      return{
        ...state,
        currValue: state.currValue.slice(0,-1)
      };
    case ACTION.EVALUATE:
      if(state.operation == null || state.prevValue == null || state.currValue == null){
        return state;
      }
      return{
        ...state,
        overwrite: true,
        prevValue: null,
        operation: null,
        currValue: Evaluate(state)
      };
  }
}
function Evaluate({prevValue, currValue, operation}){
  const prev = parseFloat(prevValue)
  const curr= parseFloat(currValue)
  if(isNaN(prev) || isNaN(curr)){
    return "";
  }
  let compute=""
  // eslint-disable-next-line default-case
  switch(operation){
    case "+":
      compute=prev+curr
      break
    case "-":
      compute=prev-curr
      break
    case "x":
      compute=prev*curr
      break
    case "÷":
      compute=prev/curr;
      break
  }
  return compute.toString();
}
const INTEGER_FORMATTER=new Intl.NumberFormat('en-us',{maximumFractionDigits:0})
function format(value){
  if(value==null)return;
  const [integer, decimal] = value.split(".")
  if(decimal==null)return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function App() {
  const [{ prevValue, currValue, operation }, dispatch] = React.useReducer(reducer, {})
  return (
    <div className="grid">
      <div className='output'>
        <div className='prev-value'>
          {format(prevValue)} {operation}
        </div>
        <div className='current-value'>
          {format(currValue)}
        </div>
      </div>
      <button className='two-block' onClick={()=> dispatch({type:ACTION.CLEAR})}>AC</button>
      <button className='one-block' onClick={()=> dispatch({type:ACTION.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='two-block' onClick={()=> dispatch({type:ACTION.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
