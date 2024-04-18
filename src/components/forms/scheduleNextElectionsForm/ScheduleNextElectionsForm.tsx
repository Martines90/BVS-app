import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import LinkInText from '@components/links/LinkInText';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';

import useContract from '@hooks/contract/useContract';

import { showErrorToast, showSuccessToast } from '@components/toasts/Toasts';
import { getNow } from '@global/helpers/date';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { addDays } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import * as Yup from 'yup';
import FormContainer from '../components/FormContainer';
import { ElectionsInfo, InitialValues } from './types';

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

// Validation Schema
const validationSchema = Yup.object().shape({
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after the start date')
});

const DateTextField = (props: any) => {
  const {
    id,
    label,
    value,
    setOpen,
    helperText,
    error,
    name,
    dataTestId,
    InputProps: { ref } = { ref: null }
  } = props;

  return (
    <TextField
      data-testid={dataTestId}
      id={id}
      ref={ref}
      label={label}
      value={value}
      name={name}
      helperText={helperText}
      error={error}
      autoComplete="off"
      onClick={() => setOpen?.((prev: any) => !prev)}
      sx={{
        '& > .MuiOutlinedInput-root input': {
          caretColor: 'transparent',
          cursor: 'pointer'
        },
        '& > .MuiOutlinedInput-root input::selection': {
          background: 'transparent'
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton sx={{ marginRight: '-10px' }}>
              <CalendarTodayOutlinedIcon />
            </IconButton>
          </InputAdornment>)
      }}
    />
  );
};

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
        <Typography variant="h5" gutterBottom textAlign="center">
          Schedule Next Elections
        </Typography>
        {electionInfo && !isThereOngoingElections
           && (
           <Formik
             initialValues={formInitialValues}
             validationSchema={validationSchema}
             onSubmit={async (values, { setSubmitting }) => {
               const startDateTimestamp = (values.startDate?.toDate().getTime() || 0) / 1000;
               const endDateTimestamp = (values.endDate?.toDate().getTime() || 0) / 1000;

               if (startDateTimestamp && endDateTimestamp) {
                 try {
                   await asyncErrWrapper(scheduleNextElections)(
                     startDateTimestamp,
                     endDateTimestamp
                   );

                   showSuccessToast('New election successfully scheduled!');
                   setElectionInfo({
                     ...electionInfo,
                     isThereOngoingElections: true
                   });
                 } catch (err) {
                   showErrorToast(`Error: ${err}`);
                 }
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
        {electionInfo && isThereOngoingElections && (
        <Alert severity="warning">
          There is an already scheduled or ongoing election!{' '}
          <LinkInText navigateTo="/elections#ongoing_next_elections">
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
