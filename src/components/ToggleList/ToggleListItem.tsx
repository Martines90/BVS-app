import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, ListItemIcon, Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { ListItemComponent } from './types';

type Props = {
  listItemComponent: ListItemComponent
};

const ToggleListItem = ({ listItemComponent }: Props) => {
  const [open, setOpen] = React.useState(false);
  const {
    labelText, component, icon, css
  } = listItemComponent;

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box sx={css}>
      <ListItemButton sx={{ pl: 0 }} onClick={handleClick}>
        {icon && (
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        )}
        <ListItemText
          sx={{ display: 'contents' }}
          primary={
            <Typography sx={{ fontWeight: 'bold' }}>{labelText}</Typography>
        }
        />
        {open ? <ExpandLess sx={{ ml: 2 }} /> : <ExpandMore sx={{ ml: 2 }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>{component}</Box>
      </Collapse>
    </Box>
  );
};

export default ToggleListItem;
