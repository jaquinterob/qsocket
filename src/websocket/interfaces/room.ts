import { Vote } from './vote';

export interface Room {
  name: string;
  history: Vote[];
  show: boolean;
}
