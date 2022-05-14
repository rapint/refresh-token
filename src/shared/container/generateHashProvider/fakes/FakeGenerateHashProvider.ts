import { IGenerateHashProvider } from '../protocols/IGenerateHashProvider';

export class FakeGenerateHashProvider implements IGenerateHashProvider {
  public generate(): string {
    return 'any_hash';
  }
}
