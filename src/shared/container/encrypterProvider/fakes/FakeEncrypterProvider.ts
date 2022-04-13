import { IEncrypter } from '../protocols/IEncrypt';

export class FakeEncrypterProvider implements IEncrypter {
  async encrypt(): Promise<string> {
    return 'any_token';
  }
}
