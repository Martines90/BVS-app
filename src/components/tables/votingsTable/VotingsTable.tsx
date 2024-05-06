import DataTable from '@components/general/DataTable/DataTable';
import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { isValidAddress } from '@global/helpers/validators';
import { Voting } from '@hooks/contract/types';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Stack } from '@mui/material';
import { AddressLike } from 'ethers';
import { useEffect, useState } from 'react';

const VotingsTable = () => {
  const { getVotingKeyAtIndex, getVotingAtKey, getNumberOfVotings } = useContract();
  const [data, setData] = useState<Voting[]>([]);
  const [totalNumberOfVotings, setTotalnumberOfVotings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadCitizensByIndexRange = async (from: number, to: number) => {
    setIsLoadingData(true);
    const numberOfVotings = await asyncErrWrapper(getNumberOfVotings)() || 0;
    const publicKeys = [];
    const _to = to > numberOfVotings ? numberOfVotings : to;
    for (let i = from; i < _to; i++) {
      /* eslint-disable no-await-in-loop */
      const votingPublicKey = await asyncErrWrapper(getVotingAtKey)(i) as AddressLike;
      if (isValidAddress(votingPublicKey)) {
        publicKeys.push({
          publicKey: votingPublicKey
        });
      } else {
        break;
      }
    }
    setTotalnumberOfVotings(numberOfVotings);
    setData(publicKeys);
    setIsLoadingData(false);
  };

  const handlePageChange = (_event: any, value: number) => {
    setCurrentPage(value);
    const from = (value - 1) * TABLE_DISPLAY_MAX_ROWS + 1;
    const to = value * TABLE_DISPLAY_MAX_ROWS;
    loadCitizensByIndexRange(from, to);
  };

  useEffect(() => {
    loadCitizensByIndexRange(0, TABLE_DISPLAY_MAX_ROWS);
  }, []);

  return (
    <LoadContent condition={false}>
      <Stack spacing={2}>
        <LabelText label="Total number of votings:" text={totalNumberOfVotings} />
        <DataTable
          tableHeadFields={['Public key']}
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
