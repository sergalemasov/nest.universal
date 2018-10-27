import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { IDialogConfigData } from './models/dialog-config-data';
import { DialogUserType } from './models/dialog-user-type';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent {
  public usernameFormControl = new FormControl('', [Validators.required]);
  public previousUsername: string;
  public dialogUserType = DialogUserType;

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
              @Inject(MAT_DIALOG_DATA) public params: IDialogConfigData) {
     this.previousUsername = params.username ? params.username : undefined;
  }

  public onSave(): void {
    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });
  }
}
