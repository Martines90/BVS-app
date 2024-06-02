import Label from '@components/general/Label/Label';
import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import ConstantsTable from '@components/tables/constantsTable/ConstantsTable';
import { showSuccessToast } from '@components/toasts/Toasts';
import { displayGweiOrGweiDecimal, gweiToWei } from '@global/helpers/number';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Box, Button, Stack, TextField
} from '@mui/material';
import { useEffect, useState } from 'react';

const labelCssSettings = {
  minWidth: '220px',
  lineHeight: '24px'
};

const ConstantsPage = () => {
  const {
    getCitizenRoleApplicationFee,
    getElectionCandidateApplicationFee,
    updateCitizenshipApplicationFee,
    updateElectionsApplicationFee
  } = useContract();
  const [citizenshipApplicationFee, setCitizenshipApplicationFee] = useState(BigInt(0));
  const [
    electionsCandidateApplicationFee,
    setElectionsCandidateApplicationFee
  ] = useState(BigInt(0));

  useEffect(() => {
    const renderConfigData = async () => {
      setCitizenshipApplicationFee(
        await asyncErrWrapper(getCitizenRoleApplicationFee)() || BigInt(0)
      );
      setElectionsCandidateApplicationFee(
        await asyncErrWrapper(getElectionCandidateApplicationFee)() || BigInt(0)
      );
    };

    renderConfigData();
  }, []);

  const modifyCitizenshipApplicationFeeAction = async () => {
    asyncErrWrapper(updateCitizenshipApplicationFee)(citizenshipApplicationFee).then(() => {
      showSuccessToast('You have successfully updated Contract citizenship application fee');
    });
  };

  const modifyElectionsCandidateApplicationFeeAction = async () => {
    asyncErrWrapper(updateElectionsApplicationFee)(electionsCandidateApplicationFee).then(() => {
      showSuccessToast('You have successfully updated Contract elections candidate application fee');
    });
  };

  const citizenshipFeeDisplay = displayGweiOrGweiDecimal(citizenshipApplicationFee).toString();
  const candidateFeeDisplay = displayGweiOrGweiDecimal(electionsCandidateApplicationFee).toString();

  return (
    <PageContainer>
      <PageTitle>
        Constants & config
      </PageTitle>
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Label text="Citizenship application free (Gwei):" css={labelCssSettings} />
            <TextField
              name="citizenship-application-fee"
              fullWidth
              value={
                citizenshipFeeDisplay
              }
              onChange={
                (e) => {
                  setCitizenshipApplicationFee(
                    gweiToWei(Number(e.target.value))
                  );
                }
              }
            />
            <Button
              sx={{ width: '160px' }}
              variant="contained"
              onClick={modifyCitizenshipApplicationFeeAction}
            >
              UPDATE
            </Button>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Label text="Election candidate application free (Gwei):" css={labelCssSettings} />
            <TextField
              name="candidate-application-fee"
              fullWidth
              value={
                candidateFeeDisplay
              }
              onChange={
                (e) => {
                  setElectionsCandidateApplicationFee(
                    gweiToWei(Number(e.target.value))
                  );
                }
              }
            />
            <Button
              sx={{ width: '160px' }}
              variant="contained"
              onClick={modifyElectionsCandidateApplicationFeeAction}
            >
              UPDATE
            </Button>
          </Stack>
          <ConstantsTable />
        </Stack>
      </Box>
    </PageContainer>
  );
};

export default ConstantsPage;
