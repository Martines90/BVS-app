import LoadContent from '@components/general/Loaders/LoadContent';
import { CircularProgressM } from '@components/general/Loaders/components/CircularProgress';
import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
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
import { BytesLike } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { keccak256 } from 'js-sha3';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

// Yup validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

type ContractInfo = {
  citizenshipApplicationFee?: number;
  appliedForCitizenship?: boolean;
  hasCitizenRole?: boolean;
};

const CitizenshipApplicationForm = () => {
  const [hash, setHash] = useState('');
  const [email, setEmail] = useState('');
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

  return (
    <FormContainer>
      <FormTitle>Citizenship Application Board</FormTitle>
      <LoadContent condition={!contractInfo}>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
          // Assuming `hash` is the state variable where the hash is stored
            const applicationHash = getBytes32keccak256Hash(
              values.email + accountPublicKey
            );

            // Call the smart contract function with the application hash
            callContractApplyForCitizenshipFn(applicationHash)
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
            errors, touched, handleChange
          }) => (
            <Form>
              <Stack spacing={2}>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    Step 1: Apply for citizenship
                  </Typography>
                  {!contractInfo?.appliedForCitizenship ? (
                    <Stack spacing={2}>
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
                        name="email"
                        label="Email address"
                        fullWidth
                        error={touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setEmail(e.target.value);
                          // Generate the hash whenever the email address changes
                          setHash(
                            keccak256(e.target.value + accountPublicKey).slice(
                              0,
                              31
                            )
                          );
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
                      <Alert severity="info">
                        You citizenship application in the BVS blockchain contract
                        already registered.
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
                    Step 2: Send your application hash
                  </Typography>
                  <Typography>
                    Send your application hash to{' '}
                    <a href="mailto:application@bvs.gov">application@bvs.gov</a>
                  </Typography>
                  <Alert severity="warning">
                    Important! Make sure:{' '}
                    <List sx={{ listStyleType: 'disc' }}>
                      <ListItem>
                        <Stack>
                          <Stack direction="row">
                            <Typography>The email sent from:</Typography>
                            <Typography sx={{ color: 'red' }}>{email}</Typography>
                          </Stack>
                          <Typography>
                            and contains the following informations:
                          </Typography>
                        </Stack>
                      </ListItem>
                      <ListItem>
                        <Stack>
                          <Typography>Your public key:</Typography>
                          <Typography sx={{ color: 'red' }}>
                            {accountPublicKey}
                          </Typography>
                        </Stack>
                      </ListItem>
                      <ListItem>
                        <Stack>
                          <Typography>Generated hash:</Typography>
                          <Typography sx={{ color: 'red' }}>{hash}</Typography>
                        </Stack>
                      </ListItem>
                    </List>
                  </Alert>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="h6">Step 3:</Typography>
                  <Typography>
                    One of our administrators will contact you to organize the
                    citizenship application interview process.
                  </Typography>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </LoadContent>
    </FormContainer>
  );
};

export default CitizenshipApplicationForm;
