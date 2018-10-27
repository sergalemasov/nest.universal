import { DialogUserType } from './dialog-user-type';

export interface IDialogResultParams {
  username: string;
  dialogType?: DialogUserType;
  previousUsername?: string;
}
