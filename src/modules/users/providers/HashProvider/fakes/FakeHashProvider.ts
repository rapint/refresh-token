import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(): Promise<string> {
    return 'any_hash';
  }

  public async compareHash(): Promise<boolean> {
    return true;
  }
}

export default FakeHashProvider;
