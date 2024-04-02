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
  ListItem
} from '@mui/material';
import { keccak256 } from 'js-sha3';
import { useUserContext } from '@hooks/context/userContext/UserContext';

const citizenshipApplicationFee = '0.5 ETH'; // Example fee

// Yup validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const CitizenshipApplicationForm = () => {
  const [hash, setHash] = useState('');
  const [email, setEmail] = useState('');
  const { userState } = useUserContext();

  const accountPublicKey = userState.walletAddress as string; // Example public key

  useEffect(() => {
    // Pre-generate hash with an empty email
    setHash(keccak256('' + accountPublicKey));
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 500, m: 'auto' }}>
      <Typography variant='h5' gutterBottom>
        Citizenship Application Board
      </Typography>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          // Here you would handle form submission
          console.log(values);
          actions.setSubmitting(false);
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
                    Citizenship application fee: {citizenshipApplicationFee}
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
                      You place in the email ({email}) the following
                      informations:
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
