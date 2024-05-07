/* eslint-disable no-await-in-loop */
import DataTable from '@components/general/DataTable/DataTable';
import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { formatDateTime } from '@global/helpers/date';
import { Voting } from '@hooks/contract/types';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Stack } from '@mui/material';
import { BytesLike } from 'ethers';
import { useEffect, useState } from 'react';

type VotingTableData = {
  key: BytesLike;
  approved: string;
  voteCount: number;
  contentIpfsHash: string;
  startDate: string;
  viewBtnLink?: string;
};

const VotingsTable = () => {
  const { getVotingKeyAtIndex, getVotingAtKey, getNumberOfVotings } = useContract();
  const [data, setData] = useState<VotingTableData[]>([]);
  const [totalNumberOfVotings, setTotalnumberOfVotings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadVotingsByIndexRange = async (from: number, to: number) => {
    setIsLoadingData(true);
    const numberOfVotings = await asyncErrWrapper(getNumberOfVotings)() || 0;
    const votings: VotingTableData[] = [];
    const _to = to > numberOfVotings ? numberOfVotings : to;
    for (let i = from; i < _to; i++) {
      const votingKey = await asyncErrWrapper(getVotingKeyAtIndex)(
        (numberOfVotings - 1) - i
      ) as BytesLike;
      const voting = await asyncErrWrapper(getVotingAtKey)(votingKey) as Voting;
      votings.push({
        key: voting.key,
        approved: voting.approved ? 'yes' : 'no',
        voteCount: voting.voteCount,
        startDate: formatDateTime(voting.startDate) || '',
        contentIpfsHash: voting.contentIpfsHash,
        viewBtnLink: `/votings#voting?voting_key=${voting.key}`
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
          tableHeadFields={['Key', 'Approved', 'Vote count', 'Start date', 'Ipfs link']}
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
