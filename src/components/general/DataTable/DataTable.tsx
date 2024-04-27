import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Box,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';
import LoadTableContent from '../Loaders/LoadTableContent';

type Props = {
  tableHeadFields: React.ReactNode[],
  data: any[],
  currentPage: number,
  handlePageChange: (_event: any, value: number) => void,
  isLoadingData: boolean
};

const DataTable = ({
  tableHeadFields, data, currentPage, handlePageChange, isLoadingData
}: Props) => {
  const totalPages = Math.ceil(data.length / TABLE_DISPLAY_MAX_ROWS);

  return (
    <Box sx={{ p: 2, minWidth: '400px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {tableHeadFields.map((tHeadField, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableCell key={`thead-key-${index}`}>{tHeadField}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadTableContent condition={isLoadingData} colSpan={2}>
              {data.slice((
                currentPage - 1
              ) * TABLE_DISPLAY_MAX_ROWS, currentPage * TABLE_DISPLAY_MAX_ROWS).map(
                (row, index) => (
                  <TableRow key={row.publicKey}>
                    <TableCell>{(currentPage - 1) * TABLE_DISPLAY_MAX_ROWS + index + 1}</TableCell>
                    <TableCell>{row.publicKey}</TableCell>
                  </TableRow>
                )
              )}
            </LoadTableContent>
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
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
    </Box>
  );
};

export default DataTable;
