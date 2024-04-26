import DataTable from '@components/general/DataTable/DataTable';
import LoadContent from '@components/general/Loaders/LoadContent';
import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { isValidAddress } from '@global/helpers/validators';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { AddressLike } from 'ethers';
import { useEffect, useState } from 'react';

type Citizen = {
  publicKey: AddressLike
};

const CitizensTable = () => {
  const { getCitizenAtIndex, getNumberOfCitizens } = useContract();
  const [data, setData] = useState<Citizen[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadCitizensByIndexRange = async (from: number, to: number) => {
    setIsLoadingData(true);
    const numberOfCitizens = await asyncErrWrapper(getNumberOfCitizens)() || 0;
    const publicKeys = [];
    const _to = to > numberOfCitizens ? numberOfCitizens : to;
    for (let i = from; i < _to; i++) {
      /* eslint-disable no-await-in-loop */
      const citizenPublicKey = await asyncErrWrapper(getCitizenAtIndex)(i) as AddressLike;
      if (isValidAddress(citizenPublicKey)) {
        publicKeys.push({
          publicKey: citizenPublicKey
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
    loadCitizensByIndexRange(from, to);
  };

  useEffect(() => {
    loadCitizensByIndexRange(0, TABLE_DISPLAY_MAX_ROWS);
  }, []);

  return (
    <LoadContent condition={false}>
      <DataTable
        tableHeadFields={['Public key']}
        handlePageChange={handlePageChange}
        data={data}
        currentPage={currentPage}
        isLoadingData={isLoadingData}
      />
    </LoadContent>
  );
};

export default CitizensTable;
