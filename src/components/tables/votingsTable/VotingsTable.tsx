/* eslint-disable no-await-in-loop */
import DataTable from '@components/general/DataTable/DataTable';
import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { formatDateTime, getNow } from '@global/helpers/date';
import { Voting } from '@hooks/contract/types';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Stack } from '@mui/material';
import { BytesLike } from 'ethers';
import { useEffect, useState } from 'react';

type VotingTableData = {
  key: BytesLike;
  status: string;
  approved: string;
  voteCount: number;
  contentIpfsHash: string;
  startDate: string;
  viewBtnLink?: string;
  isVotingWon: string;
};

const VotingsTable = () => {
  const {
    getVotingKeyAtIndex,
    getVotingAtKey,
    getNumberOfVotings,
    getVotingDuration,
    getMinPercentageOfVotes,
    getNumberOfCitizens,
    isVotingWon
  } = useContract();
  const [data, setData] = useState<VotingTableData[]>([]);
  const [totalNumberOfVotings, setTotalnumberOfVotings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const now = getNow();

  const loadVotingsByIndexRange = async (from: number, to: number) => {
    setIsLoadingData(true);
    const numberOfVotings = await asyncErrWrapper(getNumberOfVotings)() || 0;
    const votings: VotingTableData[] = [];
    const _to = to > numberOfVotings ? numberOfVotings : to;

    const votingDuration = await asyncErrWrapper(getVotingDuration)() || 0;
    const minPercentageOfVotes = await asyncErrWrapper(getMinPercentageOfVotes)() || 0;
    const numOfCitizens = await asyncErrWrapper(getNumberOfCitizens)() || 0;

    for (let i = from; i < _to; i++) {
      const votingKey = await asyncErrWrapper(getVotingKeyAtIndex)(
        (numberOfVotings - 1) - i
      ) as BytesLike;
      const voting = await asyncErrWrapper(getVotingAtKey)(votingKey) as Voting;

      const isVotingFinished = (now / 1000) > voting.startDate + votingDuration;
      const isVotingApproved = voting.approved;
      // FIX ME: numOfCitizens has to be stored in the Voting struct as a value
      const isEnoughVotesArrived = (voting.voteCount * 100) / numOfCitizens < minPercentageOfVotes;

      let status = '';

      if (!isVotingApproved && voting.startDate < now / 1000) {
        status = 'not approved';
      } else if (!isVotingApproved && voting.startDate > now / 1000) {
        status = 'waiting for approval';
      } else if (isVotingApproved && voting.startDate > now / 1000) {
        status = 'not yet started';
      } else if (isVotingApproved && !isVotingFinished) {
        status = 'in progress';
      } else if (isVotingApproved && isVotingFinished && !isEnoughVotesArrived) {
        status = 'no enough votes arrived';
      } else if (isVotingApproved && isVotingFinished && isEnoughVotesArrived) {
        const outcome = await asyncErrWrapper(isVotingWon)(voting.key, true) ? 'A win' : 'B win';
        status = `${outcome}`;
      }

      votings.push({
        key: voting.key,
        status,
        approved: voting.approved ? 'yes' : 'no',
        voteCount: voting.voteCount,
        startDate: formatDateTime(voting.startDate) || '',
        contentIpfsHash: voting.contentIpfsHash,
        viewBtnLink: `/votings#voting?voting_key=${voting.key}`,
        isVotingWon: ''
      });
    }

    setTotalnumberOfVotings(numberOfVotings);
    setData(votings);
    setIsLoadingData(false);
  };

  const handlePageChange = (_event: any, value: number) => {
    setCurrentPage(value);
    const from = (value - 1) * TABLE_DISPLAY_MAX_ROWS + 1;
    const to = value * TABLE_DISPLAY_MAX_ROWS;
    loadVotingsByIndexRange(from, to);
  };

  useEffect(() => {
    loadVotingsByIndexRange(0, TABLE_DISPLAY_MAX_ROWS);
  }, []);

  return (
    <LoadContent condition={false}>
      <Stack spacing={2}>
        <LabelText label="Total number of votings:" text={totalNumberOfVotings} />
        <DataTable
          popoverDisplayFields={['key', 'contentIpfsHash']}
          tableHeadFields={['Key', 'Status', 'Approved', 'Vote count', 'Start date', 'Ipfs link']}
          handlePageChange={handlePageChange}
          data={data}
          currentPage={currentPage}
          isLoadingData={isLoadingData}
        />
      </Stack>
    </LoadContent>
  );
};

export default VotingsTable;
