import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { showSuccessToast } from '@components/toasts/Toasts';
import { BVS_CONTRACT } from '@global/constants/blockchain';
import { TimeQuantities } from '@global/constants/general';
import { formatDateTime, formatDateTimeToTime, getNow } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Button, Stack, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type ElectionsInfo = {
  startDate?: number,
  endDate?: number
};

const CloseElectionsForm = () => {
  const { getElectionsStartDate, getElectionsEndDate, closeElections } = useContract();

  const [electionsInfo, setElectionInfo] = useState<ElectionsInfo | undefined>(undefined);

  const now = getNow();
  const electionsCanBeClosedAfterExtraTime = BVS_CONTRACT.electionsCanCloseAfterDays
  * TimeQuantities.DAY;

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

  const closeElectionsHandler = async () => {
    await asyncErrWrapper(closeElections)().then(() => {
      showSuccessToast('Election period successfully closed');
      setElectionInfo({
        startDate: 0,
        endDate: 0
      });
    });
  };

  return (
    <FormContainer>
      <FormTitle>Close elections</FormTitle>
      <LoadContent condition={!electionsInfo}>
        <Stack spacing={2}>
          {!electionsInfo?.startDate && <Typography>There are no ongoing elections</Typography>}
          {electionsInfo?.startDate
        && electionsInfo?.endDate
        && now > electionsInfo.startDate && now < electionsInfo.endDate && (
          <Stack spacing={2}>
            <Typography>Elections are in progress...</Typography>
            <Stack spacing={2} direction="row">
              <LabelText label="Elections start:" text={formatDateTime(electionsInfo.startDate)} />
              <LabelText label="Elections end:" text={formatDateTime(electionsInfo.endDate)} />
            </Stack>
          </Stack>
          )}
          {electionsInfo?.endDate && now > electionsInfo.endDate && (
            <Stack spacing={2}>
              <Typography>Elections voting period finished on {
              formatDateTimeToTime(electionsInfo.endDate)
              }
              </Typography>
              {electionsInfo.endDate + electionsCanBeClosedAfterExtraTime > now
                ? (
                  <Stack spacing={2}>
                    <Button variant="contained" onClick={closeElectionsHandler}>Close Elections</Button>
                    <Alert severity="warning">Closing elections will result winner (get more than 5% of votes) candidates will granted their political role status</Alert>
                  </Stack>
                )
                : (
                  <Stack spacing={2}>
                    <Typography>Elections can be officially closed after {
                    formatDateTimeToTime(electionsInfo.endDate + electionsCanBeClosedAfterExtraTime)
                    }
                    </Typography>
                    <Alert severity="warning">Closing elections will result winner (get more than 5% of votes) candidates will granted their political role status</Alert>
                  </Stack>
                )}
            </Stack>
          )}
        </Stack>
      </LoadContent>
    </FormContainer>
  );
};

export default CloseElectionsForm;
