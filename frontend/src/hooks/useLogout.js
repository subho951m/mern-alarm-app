import { useAuthContext } from "./useAuthContext";
import { useAlarmsContext } from "./useAlarmsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchAlarms } = useAlarmsContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    dispatchAlarms({ type: "SET_ALARMS", payload: null });
  };

  return { logout };
};
