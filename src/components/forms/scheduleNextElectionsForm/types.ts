import { Dayjs } from 'dayjs';

export type ElectionsInfo = {
  isThereOngoingElections?: boolean;
  electionStartEndInterval?: number;
};

export type InitialValues = {
  startDate: null | Dayjs;
  endDate: null | Dayjs;
};
