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
import dayjs from "dayjs";
import { Button, Grid, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

  const [nextAlarm, setNextAlarm] = useState(null);
  const [isnotification, setIsNotification] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const findNextAlarm = () => {
      let nearestAlarm = null;

      alarms.forEach((alarm) => {
        const now = dayjs();
        const alarmTime = dayjs(alarm.time);
        if (
          alarmTime.isAfter(now) &&
          (!nearestAlarm || alarmTime.isBefore(dayjs(nearestAlarm.time)))
        ) {
          nearestAlarm = alarm;
        }
      });

      setNextAlarm(nearestAlarm);
    };

    const interval = setInterval(() => {
      if (alarms !== null) findNextAlarm();
      if (
        nextAlarm !== null &&
        dayjs(nextAlarm.time).format("DD-MM-YYYY hh:mm A") ===
          dayjs().format("DD-MM-YYYY hh:mm A")
      ) {
        setIsNotification(true && nextAlarm.state);
        const detail = `Its ${dayjs(nextAlarm.time).format(
          "hh:mm A"
        )} !!! Alarm Name: ${nextAlarm.title} Description: ${
          nextAlarm.description
        }`;
        setNotification(detail);
        // console.log("Alarm!!!!!");
      }
    }, 1000); // Check every second for changes

    return () => clearInterval(interval);
  }, [alarms, nextAlarm]);

  useEffect(() => {
    const fetchAlarms = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/alarms`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ALARMS", payload: json });
      }
    };

    if (user) {
      fetchAlarms();
    }
  }, [dispatch, user]);

  const [isEditAlarm, setIsEditAlarm] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseSnackBar = () => {
    setIsNotification(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

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
          <React.Fragment key={`upcoming123`}>
            <ListSubheader sx={{ bgcolor: "background.paper" }}>
              Upcoming Alarm
            </ListSubheader>
            {nextAlarm && (
              <Alarm
                alarm={nextAlarm}
                setIsEditAlarm={setIsEditAlarm}
                handleOpen={handleOpen}
              />
            )}
          </React.Fragment>
          <ListSubheader sx={{ bgcolor: "background.paper" }}>
            Alarms
          </ListSubheader>
          {alarms &&
            alarms
              .filter((alarm) => !nextAlarm || alarm._id !== nextAlarm._id)
              .map((alarm) => (
                <React.Fragment key={alarm._id}>
                  <Alarm
                    alarm={alarm}
                    setIsEditAlarm={setIsEditAlarm}
                    handleOpen={handleOpen}
                  />
                </React.Fragment>
              ))}
        </List>
      </Paper>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <StyledFab
            color="secondary"
            aria-label="add"
            onClick={() => {
              setIsEditAlarm(null);
              handleOpen();
            }}
          >
            <AddIcon />
          </StyledFab>
        </Toolbar>
      </AppBar>
      <CardModal
        open={open}
        setOpen={setOpen}
        isEditAlarm={isEditAlarm}
        setIsEditAlarm={setIsEditAlarm}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isnotification}
        autoHideDuration={10000}
        onClose={() => setIsNotification(false)}
        message={notification}
        action={action}
      />
    </React.Fragment>
  );
}
