import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findByUsername(username: string): Promise<User> {
    return this.userRepo.findOneBy({ username });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}
