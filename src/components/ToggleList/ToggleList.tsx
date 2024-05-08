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
      <>
        <ToggleListItem listItemComponent={listItemComponent} />
        <Divider />
      </>
    ))}
  </List>
);

export default ToggleList;
