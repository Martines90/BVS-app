import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  List,
  ListItem,
  CircularProgress
} from '@mui/material';
import { keccak256 } from 'js-sha3';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import { BytesLike } from 'ethers';
import { ContractRoleskeccak256 } from '@global/types/user';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';
import { CircuralProgressM } from '@components/general/Loading/components/CircuralProgress';
import useContract from '@hooks/contract/useContract';

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

  const [contractInfo, setContractInfo] = useState<ContractInfo>({});

  const accountPublicKey = userState.walletAddress as string; // Example public key

  useEffect(() => {
    const loadContractInfo = async () => {
      const citizenshipApplicationFee = await getCitizenRoleApplicationFee();

      const appliedForCitizenship =
        await isAccountAppliedForCitizenship(accountPublicKey);

      const hasCitizenRole = !!(
        userState.walletAddress &&
        (await hasRole(ContractRoleskeccak256.CITIZEN, userState.walletAddress))
      );

      setContractInfo({
        citizenshipApplicationFee,
        appliedForCitizenship,
        hasCitizenRole
      });
    };
    // Pre-generate hash with an empty email
    loadContractInfo();
    setHash(keccak256('' + accountPublicKey).slice(0, 31));
  }, []);

  const callContractApplyForCitizenshipFn = async (
    applicantEmailPubKeyHash: BytesLike
  ) => {
    contractInfo.citizenshipApplicationFee &&
      (await applyForCitizenshipRole(
        applicantEmailPubKeyHash,
        contractInfo.citizenshipApplicationFee
      ));
  };

  if (contractInfo.hasCitizenRole) {
    return (
      <Box sx={{ width: '100%', maxWidth: 500, m: 'auto' }}>
        <Alert severity='success'>
          Your citizen role has already been granted!
        </Alert>
      </Box>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Citizenship Application Board</FormTitle>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Assuming `hash` is the state variable where the hash is stored
          const applicationHash = getBytes32keccak256Hash(
            values.email + accountPublicKey
          );

          console.log('applicationHash:', applicationHash);

          // Call the smart contract function with the application hash
          callContractApplyForCitizenshipFn(applicationHash)
            .then((response) => {
              // Handle the successful smart contract interaction
              console.log(response);
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
        {({ errors, touched, handleChange, values }) => (
          <Form>
            <Stack spacing={2}>
              <Stack spacing={2}>
                <Typography variant='h6'>
                  Step 1: Apply for citizenship
                </Typography>
                {!contractInfo.appliedForCitizenship ? (
                  <Stack spacing={2}>
                    <Typography>
                      Citizenship application fee:{' '}
                      {contractInfo.citizenshipApplicationFee ? (
                        <>
                          {contractInfo.citizenshipApplicationFee}
                          {' (wei)'}
                        </>
                      ) : (
                        <CircuralProgressM />
                      )}
                    </Typography>
                    <Typography>Your public key: {accountPublicKey}</Typography>
                    <Field
                      as={TextField}
                      name='email'
                      label='Email address'
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
                      label='Application hash'
                      value={hash} // Set the value to the state variable holding the hash
                      fullWidth
                    />
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <Typography>
                      You citizenship application in the BVS blockchian contract
                      already registered.
                    </Typography>
                  </Stack>
                )}
                <Box>
                  <Button
                    variant='contained'
                    disabled={contractInfo.appliedForCitizenship}
                    type='submit'
                  >
                    Apply for citizenship
                  </Button>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <Typography variant='h6'>
                  Step 2: Send your application hash
                </Typography>
                <Typography>
                  Send your application hash to{' '}
                  <a href='mailto:application@bvs.gov'>application@bvs.gov</a>
                </Typography>
                <Alert severity='warning'>
                  Important! Make sure:{' '}
                  <List sx={{ listStyleType: 'disc' }}>
                    <ListItem>
                      <Stack>
                        <Stack direction={'row'}>
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
                <Typography variant='h6'>Step 3:</Typography>
                <Typography>
                  One of our administrators will contact you to organise the
                  citizenship application interview process.
                </Typography>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default CitizenshipApplicationForm;
