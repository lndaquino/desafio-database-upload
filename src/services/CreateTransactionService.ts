import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      if (balance.total < value)
        throw new AppError('No balance to include new outcome.');
    }

    let categoryDb = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryDb) {
      categoryDb = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryDb);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryDb.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
