export interface IRemoveUserRepository {
  remove(id: string): Promise<void>;
}
