import DateTextField from '@components/general/DateTextField/DateTextField';
import LabelText from '@components/general/LabelText/LabelText';
import IF from '@components/general/Loaders/IF';
import LoadContent from '@components/general/Loaders/LoadContent';
import { BVS_HARDCODED_SETTINGS } from '@global/constants/blockchain';
import { TimeQuantities } from '@global/constants/general';
import {
  formatDateTimeToTime, getNow,
  toTimeUnits
} from '@global/helpers/date';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Box, Button, Stack, TextField
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

import PdfIpfsContentViewer from '@components/pdfIpfsContentViewer/PdfIpfsContentViewer';
import * as Yup from 'yup';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';

type VotingInfo = {
  firstVotingCycleStartDate?: number,
  votingCycleVoteStartCount?: number,
  votingCreditsPerCycle?: number,
  votingCycleInterval?: number,
  votingCycleCount?: number,
  isVotingCycleCloseToEnd?: boolean,
  votingCycleEndsTimeLeft?: number
};

type InitialValues = {
  startDate: Dayjs | null
  contentIpfsHash: string | null
  targetBudget: number | null
};

const formInitialValues: InitialValues = {
  startDate: null,
  contentIpfsHash: '',
  targetBudget: 0
};

const validationSchema = Yup.object().shape({
  // votingStartDate: Yup.date().required('Pick a date')
  // contentIpfsHash: Yup.string().required('Provide voting content ipfs hash reference')
});

const CreateNewVotingForm = () => {
  const {
    getFirstVotingCycleStartDate,
    getPoliticalActorVotingCredits,
    getVotingCycleInterval,
    getVotingCycleMinCloseToTheEndTime,
    getPoliticalActorVotingCycleVoteStartCount,
    scheduleNewVoting
  } = useContract();
  const { userState } = useUserContext();
  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo>({});
  const now = getNow();

  const minDate = dayjs(now
  + (BVS_HARDCODED_SETTINGS.newVotingCanStartAfterDays
  * TimeQuantities.DAY + TimeQuantities.HOUR) * 1000);

  const maxDate = dayjs(now
  + (BVS_HARDCODED_SETTINGS.newVotingCantStartAfterDays
  * TimeQuantities.DAY - TimeQuantities.HOUR) * 1000);

  useEffect(() => {
    const loadVotingInfo = async () => {
      const firstVotingCycleStartDate = await asyncErrWrapper(getFirstVotingCycleStartDate)() || 0;
      const votingCreditsPerCycle = await asyncErrWrapper(getPoliticalActorVotingCredits)(userState.walletAddress || '0x0') || 0;
      const votingCycleInterval = await asyncErrWrapper(getVotingCycleInterval)() || 0;
      const votingCycleMinCloseToTheEndTime = await getVotingCycleMinCloseToTheEndTime();

      let votingCycleVoteStartCount = 0;
      let votingCycleCount = 0;
      let votingCycleCloseToEnd = false;
      let votingCycleEndsTimeLeft = 0;
      if (now > firstVotingCycleStartDate) {
        const timePassed = now - firstVotingCycleStartDate;
        votingCycleCount = Math.ceil(timePassed / votingCycleInterval);
        votingCycleVoteStartCount = await asyncErrWrapper(
          getPoliticalActorVotingCycleVoteStartCount
        )(userState.walletAddress || '0x0', votingCycleCount - 1) || 0;

        if (
          timePassed - (votingCycleCount - 1) * votingCycleInterval
          > votingCycleInterval - votingCycleMinCloseToTheEndTime
        ) {
          votingCycleCloseToEnd = true;
        }

        votingCycleEndsTimeLeft = votingCycleCount * votingCycleInterval - timePassed;
      }
      setVotingInfo({
        firstVotingCycleStartDate,
        votingCycleVoteStartCount,
        votingCreditsPerCycle,
        votingCycleInterval,
        votingCycleCount,
        isVotingCycleCloseToEnd: votingCycleCloseToEnd,
        votingCycleEndsTimeLeft
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
            <Alert severity="warning">First voting cycle start date ({
            formatDateTimeToTime(votingInfo?.firstVotingCycleStartDate)
            }) not yet passed.
            </Alert>
          </IF>
          <IF condition={isFirstVotingCyclePassed}>
            <Stack spacing={2}>
              <LabelText
                label="Voting cycle:"
                text={`${votingInfo?.votingCycleCount}.`}
              />
              <LabelText
                label="Voting cycle ends:"
                text={toTimeUnits(votingInfo?.votingCycleEndsTimeLeft, true) as string}
              />
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
                validationSchema={validationSchema}
                initialValues={formInitialValues}
                onSubmit={async (values, { setSubmitting }) => {
                  const startDate = (values.startDate?.toDate().getTime() || 0) / 1000;
                  await asyncErrWrapper(scheduleNewVoting)(
                    values.contentIpfsHash || '',
                    startDate,
                    Number(values.targetBudget)
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
                  setFieldValue, values, errors, touched, handleChange
                }) => (
                  <Form>
                    <Stack spacing={2}>
                      <DesktopDatePicker
                        open={startDateOpen}
                        onClose={() => setStartDateOpen(false)}
                        onOpen={() => setStartDateOpen(true)}
                        label="Voting start date"
                        name="votingStartDate"
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
                      <IpfsFileUpload
                        fileInfo={fileInfo}
                        setFileInfo={setFileInfo}
                      />
                      <Field
                        as={TextField}
                        name="contentIpfsHash"
                        label="Content ipfs hash reference"
                        value={fileInfo.ipfsHash || ''}
                        fullWidth
                        error={touched.contentIpfsHash && !!errors.contentIpfsHash}
                        helperText={touched.contentIpfsHash && errors.contentIpfsHash}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setFieldValue('contentIpfsHash', e.target.value);
                          setFileInfo({
                            ...fileInfo,
                            ipfsHash: e.target.value
                          });
                        }}
                      />
                      <PdfIpfsContentViewer ipfsHash={fileInfo.ipfsHash} />
                      <Field
                        as={TextField}
                        name="targetBudget"
                        label="*Target budget (in gwei)"
                        fullWidth
                        error={touched.targetBudget && !!errors.targetBudget}
                        helperText={touched.targetBudget && errors.targetBudget}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setFieldValue('targetBudget', e.target.value);
                        }}
                      />
                      <Box textAlign="center">
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={!!votingInfo?.isVotingCycleCloseToEnd}
                        >
                          CREATE
                        </Button>
                      </Box>
                      <IF condition={!!votingInfo?.isVotingCycleCloseToEnd}>
                        <Alert severity="warning">
                          New voting can start only 10 days before ongoing voting cycle ends
                        </Alert>
                      </IF>
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
