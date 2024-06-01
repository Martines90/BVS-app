import DateTextField from '@components/general/DateTextField/DateTextField';
import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { formatDateTimeToTime, getNow } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { Button, Stack } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type VotingInfo = {
  firstVotingCycleDate: number
};

type InitialValues = {
  startDate: Dayjs | null
};

const FirstVotingCycleForm = () => {
  const { getFirstVotingCycleStartDate, setFirstVotingCycleStartDate } = useContract();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [votingInfo, setVotingInfo] = useState<VotingInfo | undefined>();
  useEffect(() => {
    const loadVotingInfo = async () => {
      const firstVotingCycleDate = await asyncErrWrapper(getFirstVotingCycleStartDate)() || 0;

      setVotingInfo({ firstVotingCycleDate });
    };

    loadVotingInfo();
  }, []);
  const formInitialValues: InitialValues = {
    startDate: null
  };

  const minDate = dayjs(getNow());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <FormTitle>First voting cycle</FormTitle>
        <LoadContent condition={!votingInfo}>
          <Formik
            initialValues={formInitialValues}
            onSubmit={async (values, { setSubmitting }) => {
              await asyncErrWrapper(setFirstVotingCycleStartDate)(
                (values.startDate?.toDate().getTime() || 0) / 1000
              ).then(() => {
                setVotingInfo({
                  firstVotingCycleDate: (values.startDate?.toDate().getTime() || 0)
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
                  <LabelText
                    label="First voting cycle start date:"
                    text={
              votingInfo && votingInfo.firstVotingCycleDate > 0 ? formatDateTimeToTime(votingInfo.firstVotingCycleDate) : 'Not yet set'
            }
                  />
                  <DesktopDatePicker
                    open={startDateOpen}
                    onClose={() => setStartDateOpen(false)}
                    onOpen={() => setStartDateOpen(true)}
                    label="Voting cycles start date"
                    name="electionsStartDate"
                    minDate={minDate}
                    defaultValue={minDate}
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
                  <Button
                    type="submit"
                    variant="contained"
                    color="info"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    SET FIRST VOTING CYCLE START DATE
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </LoadContent>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default FirstVotingCycleForm;
