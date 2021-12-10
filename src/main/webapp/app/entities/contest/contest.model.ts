import * as dayjs from 'dayjs';
import { IPicture } from 'app/entities/picture/picture.model';

export interface IContest {
  id?: number;
  name?: string;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  url?: string;
  userId?: number | null;
  pictures?: IPicture[] | null;
}

export class Contest implements IContest {
  constructor(
    public id?: number,
    public name?: string,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public url?: string,
    public userId?: number | null,
    public pictures?: IPicture[] | null
  ) {}
}

export function getContestIdentifier(contest: IContest): number | undefined {
  return contest.id;
}
