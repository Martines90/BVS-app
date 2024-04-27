import DateTextField from '@components/general/DateTextField/DateTextField';
import LabelText from '@components/general/LabelText/LabelText';
import IF from '@components/general/Loaders/IF';
import LoadContent from '@components/general/Loaders/LoadContent';
import { BVS_HARDCODED_SETTINGS } from '@global/constants/blockchain';
import { TimeQuantities } from '@global/constants/general';
import { formatDateTimeToTime, getNow } from '@global/helpers/date';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Alert, Stack } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type VotingInfo = {
  firstVotingCycleStartDate?: number,
  votingCycleVoteStartCount?: number,
  votingCreditsPerCycle?: number,
  votingCycleInterval?: number
};

type InitialValues = {
  startDate: Dayjs | null
};

const formInitialValues: InitialValues = {
  startDate: null
};

const CreateNewVotingForm = () => {
  const {
    getFirstVotingCycleStartDate,
    getPoliticalActorVotingCredits,
    getVotingCycleInterval,
    getPoliticalActorVotingCycleVoteStartCount,
    scheduleNewVoting
  } = useContract();
  const { userState } = useUserContext();
  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const now = getNow();

  const minDate = dayjs(now
  + BVS_HARDCODED_SETTINGS.newVotingCanStartAfterDays
  * TimeQuantities.DAY + TimeQuantities.HOUR);

  const maxDate = dayjs(now
  + BVS_HARDCODED_SETTINGS.newVotingCantStartAfterDays
  * TimeQuantities.DAY - TimeQuantities.HOUR);

  useEffect(() => {
    const loadVotingInfo = async () => {
      const firstVotingCycleStartDate = await asyncErrWrapper(getFirstVotingCycleStartDate)() || 0;
      const votingCreditsPerCycle = await asyncErrWrapper(getPoliticalActorVotingCredits)(userState.walletAddress || '0x0') || 0;
      const votingCycleInterval = await asyncErrWrapper(getVotingCycleInterval)() || 0;

      let votingCycleVoteStartCount = 0;
      if (now > firstVotingCycleStartDate) {
        const timePassed = now - firstVotingCycleStartDate;
        const votingCycleCount = Math.ceil(timePassed / votingCycleInterval);
        votingCycleVoteStartCount = await asyncErrWrapper(getPoliticalActorVotingCycleVoteStartCount)(userState.walletAddress || '0x0', votingCycleCount) || 0;
      }
      setVotingInfo({
        firstVotingCycleStartDate,
        votingCycleVoteStartCount,
        votingCreditsPerCycle,
        votingCycleInterval
      });
    };

    loadVotingInfo();
  }, []);

  const isFirstVotingCyclePassed = votingInfo?.firstVotingCycleStartDate
  && now > votingInfo.firstVotingCycleStartDate;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <FormTitle>Schedule new voting</FormTitle>
        <LoadContent condition={!votingInfo}>
          <IF condition={!isFirstVotingCyclePassed}>
            <Alert severity="info">First voting cycle start date ({
            formatDateTimeToTime(votingInfo?.firstVotingCycleStartDate)
            }) not yet passed.
            </Alert>
          </IF>
          <IF condition={isFirstVotingCyclePassed}>
            <Stack spacing={2}>
              <LabelText
                label="Number of voting credits left:"
                text={
          `${(votingInfo?.votingCreditsPerCycle || 0) - (votingInfo?.votingCycleVoteStartCount || 0)}/${votingInfo?.votingCreditsPerCycle}`
          }
              />
              {
          votingInfo
          && (votingInfo?.votingCreditsPerCycle || 0)
          <= (votingInfo?.votingCycleVoteStartCount || 0) ? (
            <Alert severity="info">You have no more voting credit left for this voting cycle</Alert>
            ) : (
              <Formik
                initialValues={formInitialValues}
                onSubmit={async (values, { setSubmitting }) => {
                  await asyncErrWrapper(scheduleNewVoting)(
                    'ipfs_hash',
                    (values.startDate?.toDate().getTime() || 0) / 1000,
                    0
                  ).then(() => {
                    setVotingInfo({
                      ...votingInfo,
                      votingCycleVoteStartCount: (
                        votingInfo?.votingCycleVoteStartCount || 0
                      ) + 1
                    });
                  }).finally(() => {
                    setSubmitting(false);
                  });
                }}
              >
                {({
                  setFieldValue, values, errors
                }) => (
                  <Form>
                    <Stack spacing={2}>
                      <DesktopDatePicker
                        open={startDateOpen}
                        onClose={() => setStartDateOpen(false)}
                        onOpen={() => setStartDateOpen(true)}
                        label="Voting cycles start date"
                        name="electionsStartDate"
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={(value: Dayjs | null) => {
                          setFieldValue('startDate', value);
                        }}
                        slots={{
                          field: DateTextField
                        }}
                        slotProps={{
                          field: {
                            ...{
                              setOpen: setStartDateOpen,
                              dataTestId: 'start-date',
                              value: values.startDate?.format('DD/MM/YYYY') || '',
                              name: 'start-date-field',
                              error: errors.startDate
                            } as any
                          }
                        }}
                      />
                    </Stack>
                  </Form>
                )}
              </Formik>
            )
}
            </Stack>
          </IF>
        </LoadContent>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default CreateNewVotingForm;
