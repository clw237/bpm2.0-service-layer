import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'dtos';
import { EmailSend, User } from 'entities';
import { UserRepository } from 'repositories';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger';

// Service layer will contains the business logic of the application.
// It will interact with the repository layer to perform CRUD operations.
// It will also contain the error handling logic.

@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    @InjectRepository(EmailSend)
    private readonly emailSendRepository: Repository<EmailSend>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.createUser(createUserDto);
    } catch (err) {
      this.logger.error('Failed to create user', err.stack);
      throw err;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.getAllUsers();
    } catch (err) {
      this.logger.error('Failed to get all users', err.stack);
      throw err;
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      return await this.userRepository.getUser(id);
    } catch (err) {
      this.logger.error(`Failed to get user with ID ${id}`, err.stack);
      throw err;
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.info(
        `Updating user with ID ${id} with data: ${JSON.stringify(updateUserDto)}`,
      );
      return await this.userRepository.updateUser(id, updateUserDto);
    } catch (err) {
      this.logger.error(`Failed to update user with ID ${id}`, err.stack);
      throw err;
    }
  }

  async removeUser(id: number): Promise<void> {
    try {
      this.logger.info(`Removing user with ID ${id}`);
      return await this.userRepository.removeUser(id);
    } catch (err) {
      this.logger.error(`Failed to remove user with ID ${id}`, err.stack);
      throw err;
    }
  }
}
