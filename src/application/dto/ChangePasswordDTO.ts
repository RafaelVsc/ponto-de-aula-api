export interface ChangePasswordInputDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordOutputDTO {
  success: boolean;
  message: string;
}