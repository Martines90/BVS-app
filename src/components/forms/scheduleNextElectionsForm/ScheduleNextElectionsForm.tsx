import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import * as Yup from 'yup';
import { addDays, addMonths } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import FormContainer from '../components/FormContainer';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { CircuralProgressL } from '@components/general/Loading/components/CircuralProgress';

// Validation Schema
const validationSchema = Yup.object().shape({
  startDate: Yup.date()
    .required('Start date is required')
    .min(
      addDays(new Date(), 30),
      'Start date must be at least 30 days from today'
    ),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after the start date')
});
type ElectionsInfo = {
  ELECTION_START_END_INTERVAL?: number;
};

const ScheduleNextElectionsForm = () => {
  const { userState } = useUserContext();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo | null>(null);
  const { ELECTION_START_END_INTERVAL } = electionInfo || {};

  console.log('ELECTION_START_END_INTERVAL:', ELECTION_START_END_INTERVAL);

  const addVotingIntervalToDate = (date: Dayjs) =>
    dayjs(addDays(date.toDate(), (ELECTION_START_END_INTERVAL || 0) + 1));

  const defaultStartDate = dayjs(
    addDays(new Date(), ELECTION_START_END_INTERVAL || 0)
  ); // 30 days ahead + 1 day
  const defaultEndDate = addVotingIntervalToDate(defaultStartDate); // Start date + 1 month

  useEffect(() => {
    const getElectionInfo = async () => {
      const electionStartEndInterval =
        (((await userState.contract?.ELECTION_START_END_INTERVAL()) ||
          0) as bigint) / BigInt(60 * 60 * 24);

      const isThereOngoingElections =
        (await userState.contract?.electionsStartDate()) !== BigInt(0);
      setElectionInfo({
        ELECTION_START_END_INTERVAL: Number(electionStartEndInterval)
      });
    };

    getElectionInfo();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <Typography variant='h5' gutterBottom textAlign='center'>
          Schedule Next Elections
        </Typography>
        {electionInfo ? (
          <Formik
            initialValues={{
              startDate: defaultStartDate,
              endDate: defaultEndDate
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log('Election Dates:', values);
            }}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form>
                <Stack spacing={2}>
                  <DatePicker
                    label='Elections start date'
                    name='electionsStartDate'
                    minDate={defaultStartDate}
                    value={(touched?.startDate as Dayjs) || defaultStartDate}
                    //  value={values.startDate}
                    onChange={(value: Dayjs | null) => {
                      if (
                        value &&
                        addVotingIntervalToDate(value).toDate().getTime() >
                          values.endDate.toDate().getTime()
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
                    label='Elections end date'
                    name='electionsEndDate'
                    minDate={dayjs(addMonths(values.startDate.toDate(), 1))}
                    value={(values.endDate as Dayjs) || defaultEndDate}
                    //  value={values.startDate}
                    onChange={(value: Dayjs | null) =>
                      setFieldValue('endDate', value)
                    }
                  />
                  <Button
                    type='submit'
                    variant='contained'
                    color='error'
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    SCHEDULE ELECTION
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        ) : (
          <CircuralProgressL />
        )}
      </FormContainer>
    </LocalizationProvider>
  );
};

export default ScheduleNextElectionsForm;
