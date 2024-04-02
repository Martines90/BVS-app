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

// Yup validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

type ContractInfo = {
  citizenshipApplicationFee?: number;
};

const CitizenshipApplicationForm = () => {
  const [hash, setHash] = useState('');
  const [email, setEmail] = useState('');
  const { userState } = useUserContext();

  const [contractInfo, setContractInfo] = useState<ContractInfo>({});

  const accountPublicKey = userState.walletAddress as string; // Example public key

  useEffect(() => {
    const loadContractInfo = async () => {
      const citizenshipApplicationFee = Number(
        (await userState.contract?.citizenRoleApplicationFee()) || 0
      );

      setContractInfo({
        citizenshipApplicationFee
      });
    };
    // Pre-generate hash with an empty email
    loadContractInfo();
    setHash(keccak256('' + accountPublicKey));
  }, []);

  const callContractApplyForCitizenshipFn = async (
    applicantEmailPubKeyHash: string
  ) => {
    await userState.contract?.applyForCitizenshipRole(
      applicantEmailPubKeyHash,
      {
        value: contractInfo.citizenshipApplicationFee,
        from: userState.walletAddress
      }
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, m: 'auto' }}>
      <Typography variant='h5' gutterBottom sx={{ textAlign: 'center' }}>
        Citizenship Application Board
      </Typography>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Assuming `hash` is the state variable where the hash is stored
          const applicationHash = keccak256(values.email + accountPublicKey);

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
                  Step 1: Register as applicant
                </Typography>
                <Stack spacing={2}>
                  <Typography>
                    Citizenship application fee:{' '}
                    {contractInfo.citizenshipApplicationFee ? (
                      <>
                        {contractInfo.citizenshipApplicationFee}
                        {' (wei)'}
                      </>
                    ) : (
                      <CircularProgress size={24} />
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
                      setHash(keccak256(e.target.value + accountPublicKey));
                    }}
                  />
                  <TextField
                    disabled
                    label='Application hash'
                    value={hash} // Set the value to the state variable holding the hash
                    fullWidth
                  />
                </Stack>
                <Box>
                  <Button variant='contained' type='submit'>
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
    </Box>
  );
};

export default CitizenshipApplicationForm;
