import { useState } from "react";
import dayjs from "dayjs";
import { useAlarmsContext } from "../hooks/useAlarmsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import DateTime from "./DateTime";
import { Alert, Button, Stack, Switch } from "@mui/material";

export default function AlarmForm(props) {
  const { dispatch } = useAlarmsContext();
  const { user } = useAuthContext();

  const [time, setTime] = useState(
    props.isEditAlarm === null ? dayjs() : dayjs(props.isEditAlarm.time)
  );
  const [title, setTitle] = useState(
    props.isEditAlarm === null ? "" : props.isEditAlarm.title
  );
  const [description, setDescription] = useState(
    props.isEditAlarm === null ? "" : props.isEditAlarm.description
  );
  const [state, setState] = useState(
    props.isEditAlarm === null ? true : props.isEditAlarm.state
  );
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const alarm = { time, title, description, state };

    const endpoint = `/api/alarms${
      props.isEditAlarm === null ? "" : `/${props.isEditAlarm._id}`
    }`;

    const urlMethod = props.isEditAlarm === null ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method: urlMethod,
      body: JSON.stringify(alarm),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTime(dayjs("2022-04-17T15:30"));
      setTitle("");
      setDescription("");
      setState(true);
      setError(null);
      setEmptyFields([]);
      if (props.isEditAlarm === null) {
        dispatch({ type: "CREATE_ALARM", payload: json });
      } else {
        dispatch({ type: "UPDATE_ALARM", payload: json });
      }
      props.setIsEditAlarm(null);
      props.handleClose();
    }
  };
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Alarm
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="title"
            name="title"
            label="Alarm Title"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </Grid>

        <Grid item xs={12}>
          <DateTime setTime={setTime} time={time} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="description"
            name="description"
            label="Alarm Description"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </Grid>

        <Grid item xs={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Off</Typography>
            <Switch
              onChange={(event) => {
                setState(event.target.checked);
              }}
              checked={state}
              inputProps={{
                "aria-labelledby": "switch-list-label-wifi",
              }}
            />
            <Typography>On</Typography>
          </Stack>
        </Grid>

        <Grid item xs={8}>
          <Grid container justifyContent="flex-end">
            <Button variant="text" onClick={props.handleClose}>
              Cancel
            </Button>
            <Button variant="text" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
    </>
  );
}
