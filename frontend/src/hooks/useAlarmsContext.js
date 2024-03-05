import { AlarmsContext } from "../context/AlarmContext";
import { useContext } from "react";

export const useAlarmsContext = () => {
  const context = useContext(AlarmsContext);

  if (!context) {
    throw Error(
      "useAlarmsContext must be used inside an AlarmsContextProvider"
    );
  }

  return context;
};
