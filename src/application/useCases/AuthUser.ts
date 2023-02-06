import { Encrypt } from "infra/security/Encrypt";
import { UserRepository } from "application/repositories/UserRepository";
import { AuthInvalid } from "domain/errors/AuthInvalid";
import { Authenticator } from "infra/security/Authenticator";

export class AuthUser {
  constructor(
    private readonly autenticator: Authenticator,
    private readonly encrypt: Encrypt,
    private readonly userRepository: UserRepository
  ) {}

  async execute(data: AuthUserProps) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AuthInvalid();
    }

    const isValidPass = await this.encrypt.compare(
      data.password,
      user.password
    );

    if (!isValidPass) {
      throw new AuthInvalid();
    }

    const token = this.autenticator.createToken({
      id: user.id,
      email: user.email,
    });
    return { token, user };
  }
}

export type AuthUserProps = {
  email: string;
  password: string;
};
