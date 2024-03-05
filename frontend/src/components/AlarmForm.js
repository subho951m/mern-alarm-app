import { useState } from "react";
import { useAlarmsContext } from "../hooks/useAlarmsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import DateTime from "./DateTime";
import { Button } from "@mui/material";

export default function AlarmForm(props) {
  const { dispatch } = useAlarmsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { title, load, reps };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
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
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
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
          <DateTime onChange={(e) => setTitle(e.target.value)} value={title} />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="title"
            name="title"
            label="Alarm Title"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Button variant="text" onClick={props.handleClose}>
              Cancel
            </Button>
            <Button variant="text" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
