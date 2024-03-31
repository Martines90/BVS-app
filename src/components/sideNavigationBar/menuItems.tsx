import PublicIcon from '@mui/icons-material/Public';
import ImageIcon from '@mui/icons-material/Image';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import BallotIcon from '@mui/icons-material/Ballot';

const menuItems = [
  {
    id: 0,
    icon: <BallotIcon />,
    label: 'Elections',
    route: 'elections'
  },
  {
    id: 1,
    icon: <HowToVoteIcon />,
    label: 'Votings',
    route: 'voting-pool'
  },
  {
    id: 2,
    icon: <ImageIcon />,
    label: 'Storage',
    route: 'storage'
  },
  {
    id: 3,
    icon: <PublicIcon />,
    label: 'Hosting',
    route: 'hosting'
  },
  {
    id: 4,
    icon: <SettingsEthernetIcon />,
    label: 'Functions',
    route: 'functions'
  },
  {
    id: 5,
    icon: <SettingsInputComponentIcon />,
    label: 'Machine learning',
    route: 'machine-learning'
  }
];

export default menuItems;
