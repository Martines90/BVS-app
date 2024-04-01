import ArticleIcon from '@mui/icons-material/Article';
import PublicIcon from '@mui/icons-material/Public';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BallotIcon from '@mui/icons-material/Ballot';
import { USER_MODES } from '@global/types/user';
import { MenuItem } from './types';

const menuItems: MenuItem[] = [
  {
    icon: <ThumbsUpDownIcon />,
    label: 'Approval pool',
    route: '',
    modes: [USER_MODES.ADMINISTRATOR],
    subMenuItems: [
      {
        label: 'Citizenship applications',
        route: 'approvals#citizenship',
        modes: []
      },
      {
        label: 'Scheduled votings',
        route: 'approvals#citizenship',
        modes: []
      },
      {
        label: 'Articles',
        route: 'approvals#article',
        modes: []
      },
      {
        label: 'Article responses',
        route: 'approvals#article_response',
        modes: []
      }
    ]
  },
  {
    icon: <PublicIcon />,
    label: 'Community',
    route: 'dashboard',
    modes: [],
    subMenuItems: [
      {
        label: 'Stats',
        route: 'dashboard#stats',
        modes: []
      },
      {
        label: 'Administrators',
        route: 'dashboard#administrators',
        modes: []
      },
      {
        label: 'Political actors',
        route: 'dashboard#political_actors',
        modes: []
      },
      {
        label: 'Citizens',
        route: 'dashboard#citizens',
        modes: []
      }
    ]
  },
  {
    icon: <BallotIcon />,
    label: 'Elections',
    route: 'elections',
    modes: [],
    subMenuItems: [
      {
        label: 'Next elections',
        route: 'elections#next_election',
        modes: []
      },
      {
        label: 'Onging elections',
        route: 'elections#ongoing_election',
        modes: []
      },
      {
        label: 'Past elections',
        route: 'elections#past_elections',
        modes: []
      }
    ]
  },
  {
    icon: <HowToVoteIcon />,
    label: 'Votings',
    route: 'voting-pool',
    modes: [],
    subMenuItems: [
      {
        label: 'My votings',
        route: 'elections#my_elections',
        modes: [USER_MODES.POLITICAL_ACTOR]
      },
      {
        label: 'Ongoing votings',
        route: 'elections#upcoming',
        modes: []
      },
      {
        label: 'Upcoming votings',
        route: 'elections#upcoming',
        modes: []
      },
      {
        label: 'Closed votings',
        route: 'elections#closed',
        modes: []
      }
    ]
  },
  {
    icon: <ArticleIcon />,
    label: 'Articles / responses',
    route: 'articles',
    modes: [USER_MODES.POLITICAL_ACTOR, USER_MODES.ADMINISTRATOR],
    subMenuItems: []
  }
];

export default menuItems;
