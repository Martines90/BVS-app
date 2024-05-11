import { Tooltip, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

type Props = {
  text: string | number | null,
  popText: string | number | null,
};

const StyledTypography = styled(Typography)(() => ({
  '&': {
    overflow: 'hidden',
    maxWidth: '100px',
    textOverflow: 'ellipsis'
  }
}));

const TooltipText = ({ text, popText }: Props) => (
  <Tooltip title={String(popText)}>
    <StyledTypography
      aria-haspopup="true"
    >
      {text}
    </StyledTypography>
  </Tooltip>
);

export default TooltipText;
