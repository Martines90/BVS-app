import { CircularProgressL } from '@components/general/Loaders/components/CircularProgress';
import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import { USER_ROLES } from '@global/types/user';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert,
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

// Form validation schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  publicKey: Yup.string().required('Required')
});

const CitizenshipApprovalForm = () => {
  const { grantCitizenRole } = useContract();
  const { hasRole, isHashMatchWithCitizenshipApplicationHash } = useContract();
  const [success, setSucess] = useState(false);
  const [applicationCheckIsInProgress, setApplicationCheckIsInProgress] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  const validateCitizenshipApplication = async (
    email: string,
    publicKey: string
  ) => {
    const applicationHash = getBytes32keccak256Hash(email + publicKey);

    const hashMatchesWithApplicationHash = await asyncErrWrapper(
      isHashMatchWithCitizenshipApplicationHash
    )(
      publicKey,
      applicationHash
    );

    return hashMatchesWithApplicationHash;
  };

  const checkApplicant = async (email: string, publicKey: string) => {
    // Dummy check for the example - replace this logic with your actual check

    if (email && publicKey) {
      const hasCitizenRole = await asyncErrWrapper(hasRole)(
        USER_ROLES.CITIZEN,
        publicKey
      );

      if (hasCitizenRole) {
        setValidationMessage('Applicant has already citizen role!');
        return false;
      }

      const applicationPayed = await validateCitizenshipApplication(
        email,
        publicKey
      );

      if (!applicationPayed) {
        setValidationMessage(
          'Application fee realted to this account not yet payed!'
        );
        return false;
      }

      setValidationMessage('');
      return true;
    }

    setValidationMessage('Missing email and/or public key information!');
    return false;
  };

  return (
    <FormContainer>
      <FormTitle>Citizenship Approval</FormTitle>
      <Formik
        initialValues={{ email: '', publicKey: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          // Here you would call the function to approve the applicant

          setApplicationCheckIsInProgress(true);

          const applicationValid = await checkApplicant(
            values.email,
            values.publicKey
          );

          if (applicationValid) {
            // grant citizenship role
            await asyncErrWrapper(grantCitizenRole)(
              values.publicKey,
              getBytes32keccak256Hash(values.email + values.publicKey)
            ).then((res) => {
              setSucess(true);
              console.log(res);
            })
              .catch((error) => {
              // Handle errors if the smart contract interaction fails
                console.error(error);
              })
              .finally(() => {
                setSubmitting(false); // Finish the submission process
              });
          }

          setApplicationCheckIsInProgress(false);
        }}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Stack spacing={2}>
              <Field
                as={TextField}
                name="email"
                label="Applicant email address"
                fullWidth
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ mb: 2 }}
              />
              <Field
                as={TextField}
                name="publicKey"
                label="Applicant public key"
                fullWidth
                error={touched.publicKey && Boolean(errors.publicKey)}
                helperText={touched.publicKey && errors.publicKey}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => checkApplicant(values.email, values.publicKey)}
              >
                Check if applicant exist
              </Button>
              {validationMessage !== '' && (
                <Typography>{validationMessage}</Typography>
              )}
              <Alert severity="warning" sx={{ mb: 2 }}>
                Only approve applicant if he/she passed all the interviewing
                processes
              </Alert>
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={
                  validationMessage === null || validationMessage !== ''
                }
              >
                Approve applicant
              </Button>
              {applicationCheckIsInProgress && <CircularProgressL />}
              {success && (
                <Alert severity="success">
                  Citizenship role successfully granted for user:{' '}
                  {values.publicKey}
                </Alert>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default CitizenshipApprovalForm;
