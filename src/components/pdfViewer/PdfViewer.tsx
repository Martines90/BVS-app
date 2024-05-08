import {
  Box, Button, Pagination, PaginationItem, Stack,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import styled from '@emotion/styled';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type Props = {
  documentUrl: string
};

const ZoomMinusButton = styled(Button)({
  fontWeight: 600,
  lineHeight: '22px',
  color: '#1c1111',
  minWidth: '20px',
  backgroundColor: 'burlywood',
  borderRadius: '23px',
  fontSize: '21px',
  '&:hover': {
    backgroundColor: 'burlywood'
  }
});

const ZoomPlusButton = styled(Button)({
  fontWeight: 600,
  lineHeight: '16px',
  color: '#1c1111',
  minWidth: '20px',
  backgroundColor: 'burlywood',
  borderRadius: '23px',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: 'burlywood'
  }
});

const PdfViewer = ({ documentUrl }: Props) => {
  const [numberOfPages, setNumberOfPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.5);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumberOfPages(numPages);
  };

  const handlePageChange = (_event: any, value: number) => {
    setPageNumber(value);
  };

  const zoomChange = (increase: boolean) => {
    setScale(scale + (increase ? 0.5 : -0.5));
  };

  return (
    <Stack spacing={2}>
      <Box sx={{
        width: '800px', maxWidth: '800px', maxHeight: '600px', overflow: 'scroll', border: '1px solid black', position: 'relative'
      }}
      >
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1000
        }}
        >
          <Stack direction="row" spacing={1}>
            <Typography sx={{
              fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}
            >
              Zoom (scale: {scale}):
            </Typography>
            <ZoomPlusButton variant="contained" onClick={() => zoomChange(true)}>+</ZoomPlusButton>
            <ZoomMinusButton variant="contained" onClick={() => zoomChange(false)}>-</ZoomMinusButton>
          </Stack>
        </div>
        <Document file={documentUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page scale={scale} pageNumber={pageNumber} />
        </Document>
      </Box>
      <Pagination
        count={numberOfPages}
        page={pageNumber}
        onChange={handlePageChange}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            components={{
              previous: ArrowBackIosIcon,
              next: ArrowForwardIosIcon
            }}
          />
        )}
        sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}
      />
      <p>
        Page {pageNumber} of {numberOfPages}
      </p>
    </Stack>
  );
};

export default PdfViewer;
