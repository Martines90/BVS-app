/* eslint-disable no-restricted-syntax */
import DataTable from '@components/general/DataTable/DataTable';
import LoadContent from '@components/general/Loaders/LoadContent';
import SubTitle from '@components/general/SubTitle/SubTitle';
import { TimeQuantities } from '@global/constants/general';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

type ConstantsData = {
  name: string,
  value: string | number
};

const ConstantsTable = () => {
  const { contract } = useContract();
  const [rolesConstantData, setRolesConstantData] = useState<ConstantsData[]>([]);
  const [electionsConstantData, setElectionsConstantData] = useState<ConstantsData[]>([]);
  const [votingConstantData, setVotingConstantData] = useState<ConstantsData[]>([]);
  const [contentValidationData, setContentValidationData] = useState<ConstantsData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadConstants = async () => {
    setIsLoadingData(true);

    // roles

    const _rolesConstants: { [key: string]: number | string } = {};

    _rolesConstants.MIN_PERCENTAGE_GRANT_ADMIN_APPROVALS_REQUIRED = `${await asyncErrWrapper(
      async () => Number(await contract?.MIN_PERCENTAGE_GRANT_ADMIN_APPROVALS_REQUIRED() || 0)
    )() || 0}%`;

    _rolesConstants.MAX_DAILY_NEW_CITIZENS_CAN_ADD_PERCENTAGE = `${await asyncErrWrapper(
      async () => Number(await contract?.MAX_DAILY_NEW_CITIZENS_CAN_ADD_PERCENTAGE() || 0)
    )() || 0}%`;

    _rolesConstants.CITIZEN_ROLE_APPLICATION_FEE = `${await asyncErrWrapper(
      async () => Number(await contract?.citizenRoleApplicationFee() || 0)
    )() || 0} wei`;

    setRolesConstantData(Object.keys(_rolesConstants).map((key) => ({
      name: key,
      value: _rolesConstants[key]
    })));

    const _electionConstants: { [key: string]: number | string } = {};

    _electionConstants.ELECTION_START_END_INTERVAL = `${(await asyncErrWrapper(
      async () => Number(await contract?.ELECTION_START_END_INTERVAL() || 0)
    )() || 0) / TimeQuantities.DAY} days`;

    _electionConstants.MINIMUM_PERCENTAGE_OF_ELECTION_VOTES = `${await asyncErrWrapper(
      async () => Number(await contract?.MINIMUM_PERCENTAGE_OF_ELECTION_VOTES() || 0)
    )() || 0}%`;

    _electionConstants.ELECTION_CANDIDATE_APPLICATION_FEE = `${await asyncErrWrapper(
      async () => Number(await contract?.electionsCandidateApplicationFee() || 0)
    )() || 0} wei`;

    setElectionsConstantData(Object.keys(_electionConstants).map((key) => ({
      name: key,
      value: _electionConstants[key]
    })));

    const _votingConstants: { [key: string]: number | string } = {};

    _votingConstants.MIN_VOTE_SCORE = `${await asyncErrWrapper(
      async () => Number(await contract?.MIN_VOTE_SCORE() || 0)
    )() || 0}`;

    _votingConstants.MIN_PERCENTAGE_OF_VOTES = `${await asyncErrWrapper(
      async () => Number(await contract?.MIN_PERCENTAGE_OF_VOTES() || 0)
    )() || 0}`;

    _votingConstants.VOTING_CYCLE_INTERVAL = `${(await asyncErrWrapper(
      async () => Number(await contract?.VOTING_CYCLE_INTERVAL() || 0)
    )() || 0) / TimeQuantities.DAY} days`;

    _votingConstants.VOTING_DURATION = `${(await asyncErrWrapper(
      async () => Number(await contract?.VOTING_DURATION() || 0)
    )() || 0) / TimeQuantities.DAY} days`;

    _votingConstants.APPROVE_VOTING_BEFORE_IT_STARTS_LIMIT = `${(await asyncErrWrapper(
      async () => Number(await contract?.APPROVE_VOTING_BEFORE_IT_STARTS_LIMIT() || 0)
    )() || 0) / TimeQuantities.DAY} days`;

    _votingConstants.NEW_VOTING_PERIOD_MIN_SCHEDULE_AHEAD_TIME = `${(await asyncErrWrapper(
      async () => Number(await contract?.NEW_VOTING_PERIOD_MIN_SCHEDULE_AHEAD_TIME() || 0)
    )() || 0) / TimeQuantities.DAY} days`;

    setVotingConstantData(Object.keys(_votingConstants).map((key) => ({
      name: key,
      value: _votingConstants[key]
    })));

    const _contentCheckConstants: { [key: string]: number | string } = {};

    _contentCheckConstants.MIN_TOTAL_CONTENT_READ_CHECK_ANSWER = `${await asyncErrWrapper(
      async () => Number(await contract?.MIN_TOTAL_CONTENT_READ_CHECK_ANSWER() || 0)
    )() || 0}`;

    _contentCheckConstants.CONTENT_CHECK_ASKED_NUM_OF_QUESTIONS = `${await asyncErrWrapper(
      async () => Number(await contract?.CONTENT_CHECK_ASKED_NUM_OF_QUESTIONS() || 0)
    )() || 0}`;

    setContentValidationData(Object.keys(_contentCheckConstants).map((key) => ({
      name: key,
      value: _contentCheckConstants[key]
    })));

    setIsLoadingData(false);
  };

  useEffect(() => {
    loadConstants();
  }, []);

  return (
    <LoadContent condition={false}>
      <Stack spacing={2}>
        <SubTitle text="Roles" />
        <DataTable
          cellCss={{ maxWidth: '400px' }}
          tableHeadFields={['Name', 'Value']}
          data={rolesConstantData}
          currentPage={1}
          isLoadingData={isLoadingData}
        />
        <SubTitle text="Elections" />
        <DataTable
          cellCss={{ maxWidth: '400px' }}
          tableHeadFields={['Name', 'Value']}
          data={electionsConstantData}
          currentPage={1}
          isLoadingData={isLoadingData}
        />
        <SubTitle text="Votings" />
        <DataTable
          cellCss={{ maxWidth: '400px' }}
          tableHeadFields={['Name', 'Value']}
          data={votingConstantData}
          currentPage={1}
          isLoadingData={isLoadingData}
        />
        <SubTitle text="Content validation" />
        <DataTable
          cellCss={{ maxWidth: '400px' }}
          tableHeadFields={['Name', 'Value']}
          data={contentValidationData}
          currentPage={1}
          isLoadingData={isLoadingData}
        />
      </Stack>
    </LoadContent>
  );
};

export default ConstantsTable;
