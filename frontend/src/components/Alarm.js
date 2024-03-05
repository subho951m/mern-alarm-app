import { useAlarmsContext } from "../hooks/useAlarmsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItemIcon, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Alarm({ alarm }) {
  const { dispatch } = useAlarmsContext();
  const { user } = useAuthContext();
  const { _id, time, title, description, state } = alarm;

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/alarms/" + _id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_ALARM", payload: json });
    }
  };

  const [checked, setChecked] = useState(state);

  return (
    <ListItem
      secondaryAction={
        <Switch
          edge="end"
          onChange={(event) => setChecked(event.target.checked)}
          checked={checked}
        />
      }
      disablePadding
    >
      <ListItemButton>
        <ListItemIcon>
          <IconButton edge="end" aria-label="delete">
            <EditIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemIcon>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={time} secondary={time} sx={{ width: "40%" }} />
        <ListItemText
          primary={title}
          secondary={description}
          sx={{ width: "60%" }}
        />
      </ListItemButton>
    </ListItem>
  );
}
