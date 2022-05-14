export default interface ICreateRefreshTokenDTO {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresIn: number;
  isActive: boolean;
}
