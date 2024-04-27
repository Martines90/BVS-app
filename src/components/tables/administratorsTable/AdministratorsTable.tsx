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

type Administrator = {
  publicKey: AddressLike
};

const AdministratorsTable = () => {
  const { getAdministratorAtIndex, getNumberOfAdministrators } = useContract();
  const [data, setData] = useState<Administrator[]>([]);
  const [totalNumberOfAdministrators, setTotalNumberOfAdministrators] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadAdministratorsByIndexRange = async (from: number, to: number) => {
    setIsLoadingData(true);
    const numberOfAdministrators = await asyncErrWrapper(getNumberOfAdministrators)() || 0;
    const publicKeys = [];
    const _to = to > numberOfAdministrators ? numberOfAdministrators : to;
    for (let i = from; i < _to; i++) {
      /* eslint-disable no-await-in-loop */
      const administratorPublicKey = await asyncErrWrapper(
        getAdministratorAtIndex
      )(i) as AddressLike;
      if (isValidAddress(administratorPublicKey)) {
        publicKeys.push({
          publicKey: administratorPublicKey
        });
      } else {
        break;
      }
    }
    setTotalNumberOfAdministrators(numberOfAdministrators);
    setData(publicKeys);
    setIsLoadingData(false);
  };

  const handlePageChange = (_event: any, value: number) => {
    setCurrentPage(value);
    const from = (value - 1) * TABLE_DISPLAY_MAX_ROWS + 1;
    const to = value * TABLE_DISPLAY_MAX_ROWS;
    loadAdministratorsByIndexRange(from, to);
  };

  useEffect(() => {
    loadAdministratorsByIndexRange(0, TABLE_DISPLAY_MAX_ROWS);
  }, []);

  return (
    <LoadContent condition={false}>
      <Stack spacing={2}>
        <LabelText label="Total number of administrators:" text={totalNumberOfAdministrators} />
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

export default AdministratorsTable;
