import { useEffect } from "react";
import { useAlarmsContext } from "../hooks/useAlarmsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import AddIcon from "@mui/icons-material/Add";
import Alarm from "../components/Alarm";
import CardModal from "../components/CardModal";
import { useState } from "react";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

export default function Home() {
  const { alarms, dispatch } = useAlarmsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchAlarms = async () => {
      const response = await fetch("/api/alarms", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ALARMS", payload: json });
      }
    };

    if (user) {
      fetchAlarms();
    }
  }, [dispatch, user]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  console.log(alarms);
  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square sx={{ pb: "50px" }}>
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ p: 2, pb: 0 }}
        >
          My Alarms
        </Typography>
        <List sx={{ mb: 2 }}>
          {alarms &&
            alarms.map((alarm) => (
              <React.Fragment key={alarm._id}>
                {/* {value === 0 && (
                <ListSubheader sx={{ bgcolor: "background.paper" }}>
                  Upcoming Alarm
                </ListSubheader>
              )}
              {value === 1 && (
                <ListSubheader sx={{ bgcolor: "background.paper" }}>
                  Alarm
                </ListSubheader>
              )} */}
                <Alarm alarm={alarm} />
              </React.Fragment>
            ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <StyledFab color="secondary" aria-label="add" onClick={handleOpen}>
            <AddIcon />
          </StyledFab>
        </Toolbar>
      </AppBar>
      <CardModal open={open} setOpen={setOpen} />
    </React.Fragment>
  );
}
