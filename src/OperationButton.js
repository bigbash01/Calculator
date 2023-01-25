import { ACTION } from './App';
function OperationButton({ dispatch, operation }) {
    return (
        <button className='one-block'
            onClick={() => dispatch({ type: ACTION.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
    );
}
export default OperationButton;