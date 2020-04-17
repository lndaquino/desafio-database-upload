import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    console.log(id);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.delete(id);

    if (transaction.affected === 0) throw new AppError('ID didn´t found');
  }
}

export default DeleteTransactionService;
