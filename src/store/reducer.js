import {combineReducers} from "redux";
import entitiesReducer from "./entities";

const appReducer = combineReducers({
    entities: entitiesReducer
});

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'USER_LOGGED_OUT') {
      state = undefined;
    }
  
    return appReducer(state, action);
  };
  
  export default rootReducer;