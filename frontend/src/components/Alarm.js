import { useAlarmsContext } from "../hooks/useAlarmsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItemIcon, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Alarm(props) {
  const { dispatch } = useAlarmsContext();
  const { user } = useAuthContext();
  const { _id, time, title, description, state } = props.alarm;

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

  const handleEdit = () => {
    props.setIsEditAlarm(props.alarm);
    props.handleOpen();
  };

  const [checked, setChecked] = useState(state);

  return (
    <ListItem
      secondaryAction={<Switch edge="end" checked={state} />}
      disablePadding
    >
      <ListItemButton>
        <ListItemIcon>
          <IconButton edge="end" aria-label="delete" onClick={handleEdit}>
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
