import { IContest } from 'app/entities/contest/contest.model';

export interface IPicture {
  id?: number;
  name?: string;
  url?: string;
  photograph?: string | null;
  comment?: string | null;
  nbVotes?: number | null;
  note?: number | null;
  contestId?: IContest | null;
}

export class Picture implements IPicture {
  constructor(
    public id?: number,
    public name?: string,
    public url?: string,
    public photograph?: string | null,
    public comment?: string | null,
    public nbVotes?: number | null,
    public note?: number | null,
    public contestId?: IContest | null
  ) {}
}

export function getPictureIdentifier(picture: IPicture): number | undefined {
  return picture.id;
}
