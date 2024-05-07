import { USER_MODES } from '@global/types/user';
import ArticleIcon from '@mui/icons-material/Article';
import BallotIcon from '@mui/icons-material/Ballot';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PublicIcon from '@mui/icons-material/Public';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { MenuItem } from './types';

const menuItems: MenuItem[] = [
  {
    icon: <ThumbsUpDownIcon />,
    label: 'Approval pool',
    route: '',
    modes: [USER_MODES.ADMINISTRATOR],
    subMenuItems: [
      {
        label: 'Citizenship approval',
        route: 'approvals#citizenship_approval',
        modes: []
      },
      {
        label: 'Scheduled votings',
        route: 'approvals#votings',
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
    route: 'community',
    modes: [],
    subMenuItems: [
      {
        label: 'Administrators',
        route: 'community#administrators',
        modes: []
      },
      {
        label: 'Political actors',
        route: 'community#political_actors',
        modes: []
      },
      {
        label: 'Citizens',
        route: 'community#citizens',
        modes: []
      },
      {
        label: 'Apply for citizenship',
        route: 'community#apply_for_citizenship',
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
        label: 'Ongoing & next elections',
        route: 'elections#ongoing_next_elections',
        modes: []
      },
      {
        label: 'Schedule next elections',
        route: 'elections#schedule_next_elections',
        modes: [USER_MODES.ADMINISTRATOR]
      },
      {
        label: 'Close elections',
        route: 'elections#close_elections',
        modes: [USER_MODES.ADMINISTRATOR]
      },
      {
        label: 'Register as candidate',
        route: 'elections#register_as_candidate',
        modes: [USER_MODES.CITIZEN, USER_MODES.ADMINISTRATOR]
      }
    ]
  },
  {
    icon: <HowToVoteIcon />,
    label: 'Votings',
    route: '',
    modes: [],
    subMenuItems: [
      {
        label: 'All votings',
        route: 'votings#all_votings',
        modes: []
      },
      {
        label: 'Voting',
        route: 'votings#voting',
        modes: []
      },
      {
        label: 'Create new voting',
        route: 'votings#create_new_voting',
        modes: [USER_MODES.POLITICAL_ACTOR]
      },
      {
        label: 'Assign quiz to voting',
        route: 'votings#assign_quiz_to_voting',
        modes: [USER_MODES.ADMINISTRATOR]
      },
      {
        label: 'First voting cycle',
        route: 'votings#manage_first_voting_cycle',
        modes: [USER_MODES.ADMINISTRATOR]
      }
    ]
  },
  {
    icon: <ArticleIcon />,
    label: 'Articles / responses',
    route: 'articles',
    modes: [USER_MODES.POLITICAL_ACTOR, USER_MODES.ADMINISTRATOR],
    subMenuItems: [
      {
        label: 'Assign quiz to article',
        route: 'articles#assign_quiz_to_article',
        modes: [USER_MODES.ADMINISTRATOR]
      },
      {
        label: 'Assign quiz to response',
        route: 'articles#assign_quiz_to_response',
        modes: [USER_MODES.ADMINISTRATOR]
      },
      {
        label: 'Create new article',
        route: 'articles#add_new_article',
        modes: [USER_MODES.POLITICAL_ACTOR]
      }
    ]
  }
];

export default menuItems;
