import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ToggleListItem from './ToggleListItem';
import { ListItemComponent } from './types';

type Props = {
  listItemComponents: ListItemComponent[]
};

const ToggleList = ({ listItemComponents }: Props) => (
  <List
    sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}
    component="nav"
  >
    {listItemComponents.map((listItemComponent) => (
      <Box key={listItemComponent.labelText}>
        <ToggleListItem listItemComponent={listItemComponent} />
        <Divider />
      </Box>
    ))}
  </List>
);

export default ToggleList;
