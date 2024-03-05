import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItemIcon, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Alarm(props) {
  const value = props.value;
  console.log(value);
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const labelId = `checkbox-list-secondary-label-${value}`;
  return (
    <ListItem
      key={value}
      secondaryAction={
        <Switch
          edge="end"
          onChange={handleToggle(value)}
          checked={checked.indexOf(value) !== -1}
          inputProps={{ "aria-labelledby": labelId }}
        />
      }
      disablePadding
      onClick={props.handleOpen}
    >
      <ListItemButton>
        <ListItemIcon>
          <IconButton edge="end" aria-label="delete">
            <EditIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemIcon>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primary={`08:30 PM`}
          secondary={"04-03-2024"}
          sx={{ width: "40%" }}
        />
        <ListItemText
          id={labelId}
          primary={`Line item ${value + 1}`}
          secondary={"Secondary text"}
          sx={{ width: "60%" }}
        />
      </ListItemButton>
    </ListItem>
  );
}
