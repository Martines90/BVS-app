import ButtonLink from '@components/links/ButtonLink';
import styled from '@emotion/styled';
import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Box,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  tableCellClasses
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';
import LoadTableContent from '../Loaders/LoadTableContent';
import TooltipText from '../TooltipText/TooltipText';

type Props = {
  tableHeadFields: React.ReactNode[],
  popoverDisplayFields?: string[],
  data: any[],
  currentPage: number,
  handlePageChange?: (_event: any, value: number) => void,
  isLoadingData: boolean,
  cellCss?: any
};

const STableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const DataTable = ({
  tableHeadFields,
  data,
  currentPage,
  handlePageChange = undefined,
  isLoadingData,
  popoverDisplayFields = [],
  cellCss = {}
}: Props) => {
  const totalPages = Math.ceil(data.length / TABLE_DISPLAY_MAX_ROWS);
  const CellContent = styled('div')(() => ({
    '&': {
      overflow: 'hidden',
      maxWidth: '100px',
      textOverflow: 'ellipsis',
      ...cellCss
    }
  }));

  return (
    <Box sx={{ p: 2, minWidth: '400px' }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <STableCell>#</STableCell>
              {tableHeadFields.map((tHeadField, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <STableCell key={`thead-key-${index}`}>{tHeadField}</STableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <LoadTableContent condition={isLoadingData} colSpan={2}>
              {data.slice((
                currentPage - 1
              ) * TABLE_DISPLAY_MAX_ROWS, currentPage * TABLE_DISPLAY_MAX_ROWS).map(
                (row, index) => {
                  const rowKeys = Object.keys(row);
                  return (
                    <TableRow key={row[rowKeys[0]]}>
                      <STableCell>
                        <CellContent>
                          {(currentPage - 1) * TABLE_DISPLAY_MAX_ROWS + index + 1}
                        </CellContent>
                      </STableCell>
                      {rowKeys.map((colKey) => (
                        <STableCell key={colKey}>
                          {colKey === 'viewBtnLink' ? <ButtonLink navigateTo={row[colKey]}>VISIT</ButtonLink>
                            : (
                              <CellContent>
                                {popoverDisplayFields?.includes(colKey)
                                  ? <TooltipText text={row[colKey]} popText={row[colKey]} />
                                  : row[colKey]}
                              </CellContent>
                            )}
                        </STableCell>
                      ))}
                    </TableRow>
                  );
                }
              )}
            </LoadTableContent>
          </TableBody>
        </Table>
      </TableContainer>
      {handlePageChange
      && (
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
      )}
    </Box>
  );
};

export default DataTable;
