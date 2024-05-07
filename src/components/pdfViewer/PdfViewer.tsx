import { Pagination, PaginationItem, Stack } from '@mui/material';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

type Props = {
  documentUrl: string
};

const PdfViewer = ({ documentUrl }: Props) => {
  const [numberOfPages, setNumberOfPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumberOfPages(numPages);
  };

  const handlePageChange = (_event: any, value: number) => {
    setPageNumber(value);
  };

  return (
    <Stack spacing={2}>
      <Document file={documentUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
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
