import DataTable from '@components/general/DataTable/DataTable';
import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { isValidAddress } from '@global/helpers/validators';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Stack } from '@mui/material';
import { AddressLike } from 'ethers';
import { useEffect, useState } from 'react';

type PoliticalActor = {
  publicKey: AddressLike
};

const PoliticalActorsTable = () => {
  const { getPoliticalActorAtIndex, getNumberOfPoliticalActors } = useContract();
  const [data, setData] = useState<PoliticalActor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadPoliticalActorsByIndexRange = async (from: number, to: number) => {
    setIsLoadingData(true);
    const numberOfPoliticalActors = await asyncErrWrapper(getNumberOfPoliticalActors)() || 0;
    const publicKeys = [];
    const _to = to > numberOfPoliticalActors ? numberOfPoliticalActors : to;
    for (let i = from; i < _to; i++) {
      /* eslint-disable no-await-in-loop */
      const politicalActorPublicKey = await asyncErrWrapper(
        getPoliticalActorAtIndex
      )(i) as AddressLike;
      if (isValidAddress(politicalActorPublicKey)) {
        publicKeys.push({
          publicKey: politicalActorPublicKey
        });
      } else {
        break;
      }
    }
    setData(publicKeys);
    setIsLoadingData(false);
  };

  const handlePageChange = (_event: any, value: number) => {
    setCurrentPage(value);
    const from = (value - 1) * TABLE_DISPLAY_MAX_ROWS + 1;
    const to = value * TABLE_DISPLAY_MAX_ROWS;
    loadPoliticalActorsByIndexRange(from, to);
  };

  useEffect(() => {
    loadPoliticalActorsByIndexRange(0, TABLE_DISPLAY_MAX_ROWS);
  }, []);

  return (
    <LoadContent condition={false}>
      <Stack spacing={2}>
        <LabelText label="Total number of political actors:" text={data.length} />
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

export default PoliticalActorsTable;
