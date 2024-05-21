import LoadContent from '@components/general/Loaders/LoadContent';
import {
  Box, Button, Stack, TextField, Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

import PdfIpfsContentViewer from '@components/pdfIpfsContentViewer/PdfIpfsContentViewer';
import { getVotingKeyFromHash } from '@global/helpers/routing';
import useContract from '@hooks/contract/useContract';
import { useLocation } from 'react-router-dom';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';

type VotingInfo = {
  contentIpfsHash?: string;
};

type UserInfo = {
  numOfArticleCreditsLeft?: number;
};

const formInitialValues = {
  contentIpfsHash: ''
};

const AssignArticleToVotingForm = () => {
  const { hash } = useLocation();
  const { getVotingAssignedArticlesByAccount } = useContract();
  const [votingKey, setVotingKey] = useState(getVotingKeyFromHash(hash));
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [fileInfo, setFileInfo] = useState<FileInfo>({});

  useEffect(() => {
    const loadUserInfo = async () => {
      setUserInfo({});
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    const loadAssignedArticles = async () => {
      if (votingInfo) {
        setVotingInfo({});
      }
    };

    loadAssignedArticles();
  }, [votingKey]);

  const loadVotingInfo = async () => {
    setVotingKey(votingKeyFieldVal);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer>
        <FormTitle>Assign article to voting</FormTitle>
        <Stack direction="row" spacing={2}>
          <Typography sx={{
            fontWeight: 'bold',
            lineHeight: '50px',
            display: 'table-cell'
          }}
          >
            Voting key:
          </Typography>
          <TextField
            name="voting-key"
            fullWidth
            value={votingKeyFieldVal}
            onChange={
                          (e) => { setVotingKeyFieldVal(e.target.value); }
                        }
          />
          <Button sx={{ width: '200px' }} variant="contained" onClick={() => loadVotingInfo()}>
            LOAD ASSIGNED ARTICLES
          </Button>
        </Stack>
        <LoadContent condition={!votingInfo}>
          <Formik
            initialValues={formInitialValues}
            onSubmit={async (values, { setSubmitting }) => {

            }}
          >
            {({
              setFieldValue, values, handleChange
            }) => (
              <Form>
                <Stack spacing={2}>
                  <IpfsFileUpload
                    fileInfo={fileInfo}
                    setFileInfo={setFileInfo}
                    setFieldValue={setFieldValue}
                  />
                  <Field
                    as={TextField}
                    name="contentIpfsHash"
                    label="Content ipfs hash reference"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldValue('contentIpfsHash', e.target.value);
                    }}
                  />
                  <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || ''} />
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      type="submit"
                    >
                      ASSIGN
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </LoadContent>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default AssignArticleToVotingForm;
