import LabelText from '@components/general/LabelText/LabelText';
import IF from '@components/general/Loaders/IF';
import LoadContent from '@components/general/Loaders/LoadContent';
import { showSuccessToast } from '@components/toasts/Toasts';
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
  const [closeElectionBtnEnabled, setCloseElectionBtnEnabled] = useState(true);

  const [electionsInfo, setElectionInfo] = useState<ElectionsInfo | undefined>(undefined);

  const now = getNow();

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
    setCloseElectionBtnEnabled(false);
    await asyncErrWrapper(closeElections)().then(() => {
      showSuccessToast('Election period successfully closed');
      setElectionInfo({
        startDate: 0,
        endDate: 0
      });
    }).finally(() => {
      setCloseElectionBtnEnabled(true);
    });
  };

  return (
    <FormContainer>
      <FormTitle>Close elections</FormTitle>
      <LoadContent condition={!electionsInfo}>
        <Stack spacing={2}>
          <IF condition={!electionsInfo?.startDate}>
            <Typography>There are no ongoing elections</Typography>
          </IF>
          <IF condition={electionsInfo?.startDate
            && electionsInfo?.endDate
            && now > electionsInfo.startDate && now < electionsInfo.endDate}
          >
            <Stack spacing={2}>
              <Typography textAlign="center">Elections still in progress</Typography>
              <Stack spacing={2} direction="row">
                <LabelText label="Elections start:" text={formatDateTime(electionsInfo?.startDate)} />
                <LabelText label="Elections end:" text={formatDateTime(electionsInfo?.endDate)} />
              </Stack>
            </Stack>
          </IF>
          <IF condition={electionsInfo?.startDate && now > (electionsInfo?.endDate || 0)}>
            <Stack spacing={2}>
              <Typography>Elections voting period finished on {
              formatDateTimeToTime(electionsInfo?.endDate)
              }
              </Typography>
              {(electionsInfo?.endDate || 0) < now
                && (
                  <Stack spacing={2}>
                    <Button variant="contained" disabled={!closeElectionBtnEnabled} onClick={closeElectionsHandler}>Close Elections</Button>
                    <Alert severity="warning">Closing elections will result winner (get more than 5% of votes) candidates will automatically get their political role</Alert>
                  </Stack>
                )}
            </Stack>
          </IF>
          <Stack spacing={2}>
            <Typography>Elections can be officially closed after {
                    formatDateTimeToTime(
                      (electionsInfo?.endDate || 0)
                    )
                    }
            </Typography>
            <Alert severity="warning">Closing elections will result winner (get more than 5% of votes) candidates will automatically get their political role</Alert>
          </Stack>
        </Stack>
      </LoadContent>
    </FormContainer>
  );
};

export default CloseElectionsForm;
