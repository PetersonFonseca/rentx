import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs';

import { IBaseUseCase } from '@shared/useCases';
import { IUsersRepository, IUsersTokensRepository } from '@modules/accounts/repositories';
import { AppError } from '@shared/errors';
import { IDateProvider } from '@shared/container/providers';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetUserPasswordUseCase implements IBaseUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new AppError('Token Invalid.');
    }

    const TOKEN_EXPIRES_DATE_IS_BEFORE_DATE_NOW = this.dateProvider.isBefore(
      this.dateProvider.dateNow(),
      userToken.expires_date,
    );

    if (TOKEN_EXPIRES_DATE_IS_BEFORE_DATE_NOW) {
      throw new AppError('Token Expired.');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    user.password = await hash(password, 8);

    await this.usersRepository.save(user);
    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetUserPasswordUseCase };