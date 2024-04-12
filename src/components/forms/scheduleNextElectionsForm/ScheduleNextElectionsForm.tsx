import {
  Alert,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import LinkInText from '@components/links/LinkInText';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';

import useContract from '@hooks/contract/useContract';

// eslint-disable-next-line import/no-extraneous-dependencies
import { addDays } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import * as Yup from 'yup';
import FormContainer from '../components/FormContainer';

// Validation Schema
const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after the start date')
});

type ElectionsInfo = {
  isThereOngoingElections?: boolean;
  electionStartEndInterval?: number;
};

type InitialValues = {
  startDate: null | Dayjs;
  endDate: null | Dayjs;
};

const ScheduleNextElectionsForm = () => {
  const {
    getElectionStartEndIntervalInDays,
    isThereOngoingElections: _isThereOngoingElections
  } = useContract();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo | null>(null);
  const { electionStartEndInterval, isThereOngoingElections } = electionInfo || {};

  const addVotingIntervalToDate = (date: Dayjs) => dayjs(
    addDays(date.toDate(), (electionStartEndInterval || 0) + 1)
  );

  const defaultStartDate = dayjs(
    addDays(new Date(), electionStartEndInterval || 0)
  );

  const formInitialValues: InitialValues = {
    startDate: null,
    endDate: null
  };

  useEffect(() => {
    const getElectionInfo = async () => {
      const _electionStartEndInterval = await getElectionStartEndIntervalInDays();

      const __isThereOngoingElections = await _isThereOngoingElections();
      setElectionInfo({
        isThereOngoingElections: __isThereOngoingElections,
        electionStartEndInterval: _electionStartEndInterval
      });
    };

    getElectionInfo();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <Typography variant="h5" gutterBottom textAlign="center">
          Schedule Next Elections
        </Typography>
        {electionInfo && !isThereOngoingElections
           && (
           <Formik
             initialValues={formInitialValues}
             validationSchema={validationSchema}
             onSubmit={(values) => {
               console.log('Election Dates:', values);
             }}
           >
             {({
               setFieldValue, values
             }) => (
               <Form>
                 <Stack spacing={2}>
                   <DatePicker
                     label="Elections start date"
                     name="electionsStartDate"
                     minDate={defaultStartDate}
                     onChange={(value: Dayjs | null) => {
                       if (
                         !!value
                          && ((values.endDate
                            && addVotingIntervalToDate(value).toDate().getTime()
                              > values.endDate?.toDate().getTime())
                            || !values.endDate)
                       ) {
                         console.log('end date');
                         setFieldValue(
                           'endDate',
                           addVotingIntervalToDate(value)
                         );
                       }
                       setFieldValue('startDate', value);
                     }}
                   />
                   <DatePicker
                     label="Elections end date"
                     name="electionsEndDate"
                     minDate={
                        values.startDate
                          ? addVotingIntervalToDate(values.startDate)
                          : addVotingIntervalToDate(defaultStartDate)
                      }
                     onChange={(value: Dayjs | null) => setFieldValue('endDate', value)}
                   />
                   <Button
                     type="submit"
                     variant="contained"
                     color="error"
                     fullWidth
                     sx={{ mt: 2 }}
                   >
                     SCHEDULE ELECTION
                   </Button>
                 </Stack>
               </Form>
             )}
           </Formik>
           )}
        {electionInfo && isThereOngoingElections && (
        <Alert severity="warning">
          There is an already scheduled or ongoing election!{' '}
          <LinkInText navigateTo="elections/ongoing_scheduled_elections">
            Check out elections
          </LinkInText>
        </Alert>
        )}
        {!electionInfo
          && <CommunicationWithContractIsInProgressLoader />}
      </FormContainer>
    </LocalizationProvider>
  );
};

export default ScheduleNextElectionsForm;
