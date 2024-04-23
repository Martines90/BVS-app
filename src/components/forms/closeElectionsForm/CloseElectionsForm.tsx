import LoadContent from '@components/general/Loaders/LoadContent';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type ElectionsInfo = {
  startDate?: number,
  endDate?: number
};

const CloseElectionsForm = () => {
  const { getElectionsStartDate, getElectionsEndDate } = useContract();

  const [electionsInfo, setElectionInfo] = useState<ElectionsInfo | undefined>(undefined);

  useEffect(() => {
    const getElectionsState = async () => {
      const eStartDate = await asyncErrWrapper(getElectionsStartDate)();
      const eEndDate = await asyncErrWrapper(getElectionsEndDate)();

      setElectionInfo({
        startDate: eStartDate,
        endDate: eEndDate
      });
    };

    getElectionsState();
  }, []);

  return (
    <FormContainer>
      <FormTitle>Close elections</FormTitle>
      <LoadContent condition={!!electionsInfo}>
        Content
      </LoadContent>
    </FormContainer>
  );
};

export default CloseElectionsForm;
