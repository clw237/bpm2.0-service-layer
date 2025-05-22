import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'dtos';
import { User } from 'entities';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger';
// Repository layer will contain the database operations.
// It will interact with the database to perform CRUD operations.

@Injectable()
export default class UserRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...createUserDto,
        createdAt: new Date(),
        lastModifiedAt: new Date(),
      });
      return this.usersRepository.save(newUser);
    } catch (err) {
      this.logger.error(
        `Failed to create user with data: ${JSON.stringify(createUserDto)}`,
        err.stack,
      );
      throw err;
    } finally {
      this.logger.info('Finally block');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      this.logger.info('test info message');
      return this.usersRepository.find();
    } catch (err) {
      this.logger.error('Failed to get all users', err.stack);
      throw err;
    } finally {
      this.logger.info('Finally block');
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      this.logger.info(`Getting user with ID ${id}`);
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (err) {
      this.logger.error(`Failed to get user with ID ${id}`, err.stack);
      throw err;
    } finally {
      this.logger.info('Finally block');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.info(
        `Updating user with ID ${id} with data: ${JSON.stringify(updateUserDto)}`,
      );
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updatedUser = Object.assign(user, updateUserDto, {
        lastModifiedAt: new Date(),
      });
      return this.usersRepository.save(updatedUser);
    } catch (err) {
      this.logger.error(`Failed to update user with ID ${id}`, err.stack);
      throw err;
    } finally {
      this.logger.info('Finally block');
    }
  }

  async removeUser(id: number): Promise<void> {
    try {
      this.logger.info(`Removing user with ID ${id}`);
      const result = await this.usersRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (err) {
      this.logger.error(`Failed to remove user with ID ${id}`, err.stack);
      throw err;
    } finally {
      this.logger.info('Finally block');
    }
  }
}
