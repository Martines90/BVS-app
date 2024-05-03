import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { Button } from '@mui/material';

type Props = {
  ipfsHash: string | undefined
};

const PdfIpfsContentViewer = ({ ipfsHash }: Props) => {
  const viewIpfsPdf = () => {
    window.open(`${IPFS_GATEWAY_URL}/${ipfsHash}`, '_blank', 'rel=noopener noreferrer');
  };

  return (
    <Button disabled={!ipfsHash} onClick={viewIpfsPdf}>VIEW</Button>
  );
};

export default PdfIpfsContentViewer;
