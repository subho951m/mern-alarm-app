import { createContext, useReducer } from "react";

export const AlarmsContext = createContext();

export const alarmsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALARMS":
      return {
        alarms: action.payload,
      };
    case "CREATE_ALARM":
      return {
        alarms: [action.payload, ...state.alarms],
      };
    case "DELETE_ALARM":
      return {
        alarms: state.alarms.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const AlarmsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alarmsReducer, {
    alarms: null,
  });

  return (
    <AlarmsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AlarmsContext.Provider>
  );
};
