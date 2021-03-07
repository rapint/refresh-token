export default interface ICreateRefreshTokenDTO {
  access_token: string;
  refresh_token: string;
  user_id: string;
  expires_in: number;
  is_active: boolean;
}
