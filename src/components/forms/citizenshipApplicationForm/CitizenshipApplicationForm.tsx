/* eslint-disable max-lines */
import DateTextField from '@components/general/DateTextField/DateTextField';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CircularProgressM } from '@components/general/Loaders/components/CircularProgress';
import { getNow } from '@global/helpers/date';
import { toBytes32ToKeccak256 } from '@global/helpers/hash-manipulation';
import { USER_ROLES } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { BytesLike } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { keccak256 } from 'js-sha3';
import React, { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type ContractInfo = {
  citizenshipApplicationFee?: bigint;
  appliedForCitizenship?: boolean;
  hasCitizenRole?: boolean;
};

type UserInfo = {
  email?: string;
  firstName?: string;
  middleNames?: string;
  lastName?: string;
  birthDate?: Dayjs | null;
  birthCountry?: string;
  birthState?: string;
  birthCity?: string;
};

const CitizenshipApplicationForm = () => {
  const [hash, setHash] = useState<BytesLike>('');
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [startDateOpen, setStartDateOpen] = useState(false);
  const { userState } = useUserContext();
  const {
    getCitizenRoleApplicationFee,
    isAccountAppliedForCitizenship,
    hasRole,
    applyForCitizenshipRole
  } = useContract();

  const [contractInfo, setContractInfo] = useState<ContractInfo>();

  const accountPublicKey = userState.walletAddress as string; // Example public key

  useEffect(() => {
    const loadContractInfo = async () => {
      const citizenshipApplicationFee = await asyncErrWrapper(getCitizenRoleApplicationFee)();

      if (!citizenshipApplicationFee) return;

      const appliedForCitizenship = await asyncErrWrapper(isAccountAppliedForCitizenship)(
        accountPublicKey
      );

      const hasCitizenRole = !!(
        userState.walletAddress
        && (await asyncErrWrapper(hasRole)(USER_ROLES.CITIZEN, userState.walletAddress))
      );

      setContractInfo({
        citizenshipApplicationFee,
        appliedForCitizenship,
        hasCitizenRole
      });
    };
    // Pre-generate hash with an empty email
    loadContractInfo();
    setHash(keccak256(`${accountPublicKey}`).slice(0, 31));
  }, []);

  useEffect(() => {
    const userData = '';

    setHash(
      toBytes32ToKeccak256(
        userData.concat(
          userInfo.firstName || '',
          userInfo.middleNames || '',
          userInfo.lastName || '',
          userInfo.birthDate?.format('DD/MM/YYYY') || '',
          userInfo.birthCountry || '',
          userInfo.birthState || '',
          userInfo.birthCity || '',
          accountPublicKey
        )
      )
    );
  }, [userInfo]);

  const callContractApplyForCitizenshipFn = async (
    applicantEmailPubKeyHash: BytesLike
  ) => contractInfo?.citizenshipApplicationFee
      && (await asyncErrWrapper(applyForCitizenshipRole)(
        applicantEmailPubKeyHash,
        contractInfo.citizenshipApplicationFee
      ));

  if (contractInfo?.hasCitizenRole) {
    return (
      <Box sx={{ width: '100%', maxWidth: 500, m: 'auto' }}>
        <Alert severity="success">
          Your citizen role has already been granted!
        </Alert>
      </Box>
    );
  }

  const startDate = dayjs(getNow());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <FormTitle>Citizenship Application Board</FormTitle>
        <LoadContent condition={!contractInfo}>
          <Formik
            initialValues={{
              firstName: '',
              middleNames: '',
              lastName: '',
              birthDate: undefined,
              birthCountry: '',
              birthState: '',
              birthCity: ''
            }}
            onSubmit={(values, { setSubmitting }) => {
            // Call the smart contract function with the application hash
              callContractApplyForCitizenshipFn(hash)
                .then(() => {
                  setContractInfo({
                    ...contractInfo,
                    appliedForCitizenship: true
                  });
                })
                .catch((error) => {
                  // Handle errors if the smart contract interaction fails
                  console.error(error);
                })
                .finally(() => {
                  setSubmitting(false); // Finish the submission process
                });
            }}
          >
            {({
              errors, values, handleChange, setFieldValue
            }) => (
              <Form>
                <Stack spacing={2}>
                  <Stack spacing={2}>
                    {!contractInfo?.appliedForCitizenship ? (
                      <Stack spacing={2}>
                        <Typography variant="h6">
                          Step 1: Apply for citizenship
                        </Typography>
                        <Alert severity="info">
                          Important: Your personal data will not get stored/sent to anywhere
                          , here we only generate a hash key and that will be stored only!
                        </Alert>
                        <Typography>
                          Citizenship application fee:{' '}
                          {contractInfo?.citizenshipApplicationFee ? (
                            <>
                              {contractInfo?.citizenshipApplicationFee}
                              {' (wei)'}
                            </>
                          ) : (
                            <CircularProgressM />
                          )}
                        </Typography>
                        <Typography>Your public key: {accountPublicKey}</Typography>
                        <Field
                          as={TextField}
                          name="firstName"
                          label="First name"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setUserInfo({
                              ...userInfo,
                              firstName: e.target.value
                            });
                          }}
                        />
                        <Field
                          as={TextField}
                          name="middleNames"
                          label="Middle name(s)"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setUserInfo({
                              ...userInfo,
                              middleNames: e.target.value
                            });
                          }}
                        />
                        <Field
                          as={TextField}
                          name="lastName"
                          label="Last name"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setUserInfo({
                              ...userInfo,
                              lastName: e.target.value
                            });
                          }}
                        />
                        <DesktopDatePicker
                          open={startDateOpen}
                          onClose={() => setStartDateOpen(false)}
                          onOpen={() => setStartDateOpen(true)}
                          label="Birth date"
                          name="birthDate"
                          defaultValue={startDate}
                          onChange={(value: Dayjs | null) => {
                            setFieldValue('birthDate', value);
                            setUserInfo({
                              ...userInfo,
                              birthDate: value
                            });
                          }}
                          slots={{
                            field: DateTextField
                          }}
                          slotProps={{
                            field: {
                              ...{
                                setOpen: setStartDateOpen,
                                dataTestId: 'birth-date',
                                value: (values.birthDate as any)?.format('DD/MM/YYYY') || '',
                                name: 'birth-date-field',
                                error: errors.birthDate
                              } as any
                            }
                          }}
                        />
                        <Field
                          as={TextField}
                          name="birthCountry"
                          label="Birth country"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setUserInfo({
                              ...userInfo,
                              birthCountry: e.target.value
                            });
                          }}
                        />
                        <Field
                          as={TextField}
                          name="birthState"
                          label="Birth state"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setUserInfo({
                              ...userInfo,
                              birthState: e.target.value
                            });
                          }}
                        />
                        <Field
                          as={TextField}
                          name="birthCity"
                          label="Birth city"
                          fullWidth
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            setUserInfo({
                              ...userInfo,
                              birthCity: e.target.value
                            });
                          }}
                        />
                        <TextField
                          disabled
                          label="Application hash"
                          value={hash} // Set the value to the state variable holding the hash
                          fullWidth
                        />
                      </Stack>
                    ) : (
                      <Stack spacing={2}>
                        <Typography variant="h6">
                          Step 1: Apply for citizenship (completed)
                        </Typography>
                        <Alert severity="info">
                          You citizenship application successfully{' '}
                          registered into the blockchain network
                        </Alert>
                      </Stack>
                    )}
                    <Box textAlign="center">
                      <Button
                        variant="contained"
                        disabled={contractInfo?.appliedForCitizenship}
                        type="submit"
                      >
                        Apply for citizenship
                      </Button>
                    </Box>
                  </Stack>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      Step 2: Send your application info to{' '}
                      <a href="mailto:application@bvs.gov">application@bvs.gov</a> email address
                    </Typography>
                    <Alert severity="warning">
                      Important! Make sure your application email contains:
                      <List sx={{ listStyleType: 'disc' }}>
                        <ListItem>
                          <Stack>
                            <Typography>*Your public key:</Typography>
                            <Typography sx={{ color: 'red' }}>
                              {accountPublicKey}
                            </Typography>
                          </Stack>
                        </ListItem>
                      </List>
                    </Alert>
                  </Stack>
                  <Stack spacing={2}>
                    <Typography variant="h6">Step 3:</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      One of our administrators will contact you to organize the
                      citizenship application interview process. Where we:
                    </Typography>
                    <List sx={{ listStyleType: 'disc' }}>
                      <ListItem>
                        <Typography>
                          *Schedule a personal or video call
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography>
                          *We ask for your documents to prove that your identity
                          {' '}matches with your provided data
                        </Typography>
                      </ListItem>
                    </List>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </LoadContent>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default CitizenshipApplicationForm;
