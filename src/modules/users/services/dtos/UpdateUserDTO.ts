export interface IUpdateUserDTO {
  name: string;
  password?: string;
  oldPassword?: string;
  userId: string;
}
