import { showErrorToast, showSuccessToast } from '@components/toasts/Toasts';
import { apiBaseUrl } from '@global/config';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import {
  Box,
  Button, Stack, Typography
} from '@mui/material';
import axios from 'axios';

export type FileInfo = {
  file?: any;
  name?: string;
};

type Props = {
  fileInfo: FileInfo;
  setFileInfo: React.Dispatch<React.SetStateAction<FileInfo>>;
  setFieldValue: any;
  setInputFieldValue?: any;
};

const IpfsFileUpload = (
  {
    fileInfo, setFileInfo, setFieldValue, setInputFieldValue = undefined
  }: Props
) => {
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('file', file);

        axios.post(`${apiBaseUrl}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then((response) => {
            if (response.status === 200) {
              setFileInfo({
                file,
                name: file.name
              });
              setFieldValue('contentIpfsHash', response.data.ipfsHashKey);
              if (setInputFieldValue) setInputFieldValue(response.data.ipfsHashKey);
              showSuccessToast(`File (${file.name}) successfully uploaded to ipfs network`);
            } else {
              showErrorToast(`File upload failed with error: ${response.data.err}`);
            }
            return response;
          });
      }
    } else {
      showErrorToast('Only PDF files are allowed.');
      setFileInfo({});
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography>
        *Upload pdf to ipfs network (QuickNode)
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2 }}
      >
        Upload File (*pdf)
        <input
          data-testid="pdf-file-upload-input"
          type="file"
          hidden
          onChange={handleFileChange}
          accept="application/pdf"
        />
      </Button>
      <Stack>
        {fileInfo.name && (
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            File: {fileInfo.name}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default IpfsFileUpload;
