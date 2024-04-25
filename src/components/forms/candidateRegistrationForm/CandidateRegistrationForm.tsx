import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import { formatDateTime, getNow } from '@global/helpers/date';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Box, Button, Stack, Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type ContractInfo = {
  candidateApplicationFee?: number;
  registeredAsCandidate?: boolean;
  electionStartDate?: number;
};

const CandidateRegistrationForm = () => {
  const { userState } = useUserContext();
  const {
    getElectionCandidateApplicationFee,
    getElectionsStartDate,
    isCandidateAlreadyApplied,
    applyForElectionsAsCandidate
  } = useContract();

  const [contractInfo, setContractInfo] = useState<ContractInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const accountPublicKey = userState.walletAddress as string; // Example public key

  useEffect(() => {
    const loadContractInfo = async () => {
      const candidateApplicationFee = await asyncErrWrapper(getElectionCandidateApplicationFee)();

      if (!candidateApplicationFee) return;

      const electionStartDate = await asyncErrWrapper(getElectionsStartDate)();

      const registeredAsCandidate = await asyncErrWrapper(isCandidateAlreadyApplied)(
        accountPublicKey
      );

      setIsLoading(false);

      setContractInfo({
        candidateApplicationFee,
        registeredAsCandidate,
        electionStartDate
      });
    };
    // Pre-generate hash with an empty email
    loadContractInfo();
  }, []);

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  const callContractApplyAsCandidateFn = async () => contractInfo?.candidateApplicationFee
      && (await asyncErrWrapper(applyForElectionsAsCandidate)(
        contractInfo.candidateApplicationFee
      ));

  const nextElectionsStartDate = formatDateTime(contractInfo?.electionStartDate || 0);

  if (contractInfo?.electionStartDate === 0) {
    return (
      <FormContainer>
        <Alert severity="info">
          There is no ongoing or upcoming election.
        </Alert>
      </FormContainer>
    );
  }

  if (contractInfo?.registeredAsCandidate) {
    return (
      <FormContainer>
        <Alert severity="success">
          Your already registered as candidate.
        </Alert>
      </FormContainer>
    );
  }

  if (contractInfo?.electionStartDate && contractInfo.electionStartDate < getNow()) {
    return (
      <FormContainer>
        <Alert severity="info">
          {`Elections already stared (${nextElectionsStartDate}).`}
          Candidate registration is not anymore open.
        </Alert>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Candidate Registration Form</FormTitle>
      <LoadContent condition={!contractInfo}>
        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {
            callContractApplyAsCandidateFn()
              .then(() => {
                setContractInfo({
                  ...contractInfo,
                  registeredAsCandidate: true
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
          {() => (
            <Form>
              <Stack spacing={2}>
                <Typography>
                  Next elections will start on: {nextElectionsStartDate}
                </Typography>
                {!contractInfo?.registeredAsCandidate && (
                <Stack spacing={2}>
                  <Typography>
                    Candidate application fee:{' '}
                    {contractInfo?.candidateApplicationFee && (
                      <>
                        {contractInfo.candidateApplicationFee}
                        {' (wei)'}
                      </>
                    )}
                  </Typography>
                </Stack>
                )}
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    type="submit"
                  >
                    Register as candidate
                  </Button>
                </Box>
                <Alert severity="info">
                  After you successfully registered as a candidate,{' '}
                  citizens can vote on you during the elections voting period
                </Alert>
              </Stack>
            </Form>
          )}
        </Formik>
      </LoadContent>
    </FormContainer>
  );
};

export default CandidateRegistrationForm;
