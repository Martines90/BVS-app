import {
  Alert,
  Button,
  Stack
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import LinkInText from '@components/links/LinkInText';

import useContract from '@hooks/contract/useContract';

import { showSuccessToast } from '@components/toasts/Toasts';
import { getNow } from '@global/helpers/date';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { addDays } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import * as Yup from 'yup';
import FormContainer from '../components/FormContainer';
import { ElectionsInfo, InitialValues } from './types';

import DateTextField from '@components/general/DateTextField/DateTextField';
import LoadContent from '@components/general/Loaders/LoadContent';
import FormTitle from '../components/FormTitle';

// Validation Schema
const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after the start date')
});

const ScheduleNextElectionsForm = () => {
  const {
    getElectionStartEndIntervalInDays,
    isThereOngoingElections: _isThereOngoingElections,
    scheduleNextElections
  } = useContract();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo | null>(null);
  const { electionStartEndInterval, isThereOngoingElections } = electionInfo || {};

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const addVotingIntervalToDate = (date: Dayjs) => dayjs(
    addDays(date.toDate(), (electionStartEndInterval || 0) + 1)
  );

  const defaultStartDate = dayjs(
    addDays(getNow(), electionStartEndInterval || 0)
  );

  const formInitialValues: InitialValues = {
    startDate: null,
    endDate: null
  };

  useEffect(() => {
    const getElectionInfo = async () => {
      const _electionStartEndInterval = await asyncErrWrapper(getElectionStartEndIntervalInDays)();
      const __isThereOngoingElections = await asyncErrWrapper(_isThereOngoingElections)();

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
        <FormTitle>Schedule Next Elections</FormTitle>
        <LoadContent condition={!electionInfo}>
          {!isThereOngoingElections
           && (
           <Formik
             initialValues={formInitialValues}
             validationSchema={validationSchema}
             onSubmit={async (values, { setSubmitting }) => {
               const startDateTimestamp = (values.startDate?.toDate().getTime() || 0) / 1000;
               const endDateTimestamp = (values.endDate?.toDate().getTime() || 0) / 1000;

               if (startDateTimestamp && endDateTimestamp) {
                 await asyncErrWrapper(scheduleNextElections)(
                   startDateTimestamp,
                   endDateTimestamp
                 ).then(() => {
                   showSuccessToast('New election successfully scheduled!');
                   setElectionInfo({
                     ...electionInfo,
                     isThereOngoingElections: true
                   });
                 });
               }

               setSubmitting(false);
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
                         setFieldValue(
                           'endDate',
                           addVotingIntervalToDate(value)
                         );
                       }
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
                   <DesktopDatePicker
                     open={endDateOpen}
                     onClose={() => setEndDateOpen(false)}
                     onOpen={() => setEndDateOpen(true)}
                     label="Elections end date"
                     name="electionsEndDate"
                     minDate={
                        values.startDate
                          ? addVotingIntervalToDate(values.startDate)
                          : addVotingIntervalToDate(defaultStartDate)
                      }
                     onChange={(value: Dayjs | null) => setFieldValue('endDate', value)}
                     slots={{
                       field: DateTextField
                     }}
                     slotProps={{
                       field: {
                         ...{
                           setOpen: setEndDateOpen,
                           dataTestId: 'end-date',
                           value: values.endDate?.format('DD/MM/YYYY') || '',
                           name: 'end-date-field'
                         } as any
                       }
                     }}
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
          {isThereOngoingElections && (
          <Alert severity="warning">
            There is an already scheduled or ongoing election!{' '}
            <LinkInText navigateTo="/elections#ongoing_next_elections">
              Check out elections
            </LinkInText>
          </Alert>
          )}
        </LoadContent>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default ScheduleNextElectionsForm;
