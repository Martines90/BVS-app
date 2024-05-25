import { lazy } from 'react';

import { useLocation } from 'react-router-dom';

// community
const ApplyForCitizenshipPage = lazy(
  () => import('@pages/community/apply-for-citizenship/ApplyForCitizenshipPage')
);

const CitizensPage = lazy(
  () => import('@pages/community/citizens/CitizensPage')
);

const PoliticalActorsPage = lazy(
  () => import('@pages/community/political-actors/PoliticalActorsPage')
);

const AdministratorsPage = lazy(
  () => import('@pages/community/administrators/AdministratorsPage')
);

// approvals
const ApproveCitizenshipApplicationPage = lazy(
  () => import('@pages/approvals/approve-citizenship-application/ApproveCitizenshipApplicationPage')
);

const ApproveVotingPage = lazy(
  () => import('@pages/approvals/approve-voting/ApproveVotingPage')
);

const ApproveProConArticlePage = lazy(
  () => import('@pages/approvals/approve-pro-con-article/ApproveProConArticlePage')
);

// votings

const CreateNewVotingPage = lazy(
  () => import('@pages/votings/create-new-voting/CreateNewVotingPage')
);

const AllVotingsPage = lazy(
  () => import('@pages/votings/all-votings/AllVotingsPage')
);

const AssignArticleToVotingPage = lazy(
  () => import('@pages/votings/assign-article-to-voting/AssignArticleToVotingPage')
);

const VotingPage = lazy(
  () => import('@pages/votings/voting/VotingViewPage')
);

const FirstVotingCycleStartDatePage = lazy(
  () => import('@pages/votings/first-voting-cycle-start/FirstVotingCycleStartPage')
);

// elections
const ScheduleNextElectionsPage = lazy(
  () => import('@pages/elections/schedule-next-elections/ScheduleNextElectionsPage')
);
const CloseElectionsPage = lazy(
  () => import('@pages/elections/close-elections/CloseElectionsPage')
);
const OngoingAndScheduledElectionsPage = lazy(
  () => import('@pages/elections/ongoing-scheduled-elections/OngoingScheduledElectionsPage')
);
const RegisterAsCandidatePage = lazy(
  () => import('@pages/elections/register-as-candidate/RegisterAsCandidatePage')
);

// articles

const AssignResponseToVotingPage = lazy(
  () => import('@pages/articles/assign-response-to-article/AssignResponseToArticlePage')
);

const HashRoutes = ({ mainPageName }: { mainPageName: string }) => {
  const { hash } = useLocation();

  // community
  if (hash.includes('#citizens')) {
    return <CitizensPage />;
  }

  if (hash.includes('#political_actors')) {
    return <PoliticalActorsPage />;
  }

  if (hash.includes('#administrators')) {
    return <AdministratorsPage />;
  }

  if (hash.includes('#apply_for_citizenship')) {
    return <ApplyForCitizenshipPage />;
  }

  // approvals
  if (hash.includes('#citizenship_approval')) {
    return <ApproveCitizenshipApplicationPage />;
  }

  if (hash.includes('#voting_approval')) {
    return <ApproveVotingPage />;
  }

  if (hash.includes('#pro_con_article_approval')) {
    return <ApproveProConArticlePage />;
  }

  // votings
  if (hash.includes('#create_new_voting')) {
    return <CreateNewVotingPage />;
  }

  if (hash.includes('#all_votings')) {
    return <AllVotingsPage />;
  }

  if (hash.includes('#voting')) {
    return <VotingPage />;
  }

  if (hash.includes('#assign_article_to_voting')) {
    return <AssignArticleToVotingPage />;
  }

  if (hash.includes('#manage_first_voting_cycle')) {
    return <FirstVotingCycleStartDatePage />;
  }

  // elections
  if (hash.includes('#schedule_next_elections')) {
    return <ScheduleNextElectionsPage />;
  }

  if (hash.includes('#close_elections')) {
    return <CloseElectionsPage />;
  }

  if (hash.includes('#ongoing_next_elections')) {
    return <OngoingAndScheduledElectionsPage />;
  }

  if (hash.includes('#register_as_candidate')) {
    return <RegisterAsCandidatePage />;
  }

  // articles

  if (hash.includes('#assign_response_to_article')) {
    return <AssignResponseToVotingPage />;
  }

  return (
    <div>
      Welcome at {mainPageName} {hash ? `(${hash})` : ''} page
    </div>
  );
};

export default HashRoutes;
