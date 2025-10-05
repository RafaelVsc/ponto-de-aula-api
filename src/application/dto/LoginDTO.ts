export interface LoginUserInputDTO {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginOutPutDTO {
  token: string;
}
