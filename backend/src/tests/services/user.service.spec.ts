// import { NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from 'entities';
// import { UserRepository } from 'repositories';
// import { UserService } from 'services';
// import { Repository } from 'typeorm';
// import { LoggerService } from '../../logger';

// jest.mock('kfone-common-library', () => ({
//   Logger: jest.fn().mockImplementation(() => ({
//     log: jest.fn(),
//     info: jest.fn(),
//     debug: jest.fn(),
//     warn: jest.fn(),
//     error: jest.fn(),
//   })),
//   LogLevel: {
//     INFO: 'info',
//     DEBUG: 'debug',
//     WARN: 'warn',
//     ERROR: 'error',
//   },
//   ServiceName: {
//     REFERENCEMODULE: 'ReferenceModule',
//   },
// }));

// const mockUser: User = {
//   id: 1,
//   username: 'testuser',
//   email: 'testuser@example.com',
//   createdAt: new Date(),
//   lastModifiedAt: new Date(),
// };

// describe('UserService', () => {
//   let userService: UserService;
//   let userRepository: UserRepository;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         UserRepository,
//         {
//           provide: getRepositoryToken(User),
//           useClass: Repository,
//         },
//         {
//           provide: LoggerService,
//           useFactory: () => LoggerService.getInstance(),
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);
//     userRepository = module.get<UserRepository>(UserRepository);
//   });

//   it('should be defined', () => {
//     expect(userService).toBeDefined();
//     expect(userRepository).toBeDefined();
//   });

//   describe('createUser', () => {
//     it('should create a new user', async () => {
//       jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);
//       expect(await userService.createUser(mockUser)).toEqual(mockUser);
//       expect(userRepository.createUser).toHaveBeenCalledWith(mockUser);
//     });

//     it('should log and rethrow error on createUser', async () => {
//       const error = new Error('Failed to create user');
//       jest.spyOn(userRepository, 'createUser').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userService['logger'], 'error');

//       await expect(userService.createUser(mockUser)).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         'Failed to create user',
//         error.stack,
//       );
//     });
//   });

//   describe('getAllUsers', () => {
//     it('should return all users', async () => {
//       jest
//         .spyOn(userRepository, 'getAllUsers')
//         .mockResolvedValueOnce([mockUser]);
//       expect(await userService.getAllUsers()).toEqual([mockUser]);
//       expect(userRepository.getAllUsers).toHaveBeenCalled();
//     });

//     it('should log and rethrow error on getAllUsers', async () => {
//       const error = new Error('Failed to get all users');
//       jest.spyOn(userRepository, 'getAllUsers').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userService['logger'], 'error');

//       await expect(userService.getAllUsers()).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         'Failed to get all users',
//         error.stack,
//       );
//     });
//   });

//   describe('getUser', () => {
//     it('should return the user if it exists', async () => {
//       jest.spyOn(userRepository, 'getUser').mockResolvedValueOnce(mockUser);
//       expect(await userService.getUser(1)).toEqual(mockUser);
//       expect(userRepository.getUser).toHaveBeenCalledWith(1);
//     });

//     it('should throw NotFoundException if user does not exist', async () => {
//       jest
//         .spyOn(userRepository, 'getUser')
//         .mockRejectedValueOnce(new NotFoundException('User not found'));
//       await expect(userService.getUser(101)).rejects.toThrow(NotFoundException);
//       expect(userRepository.getUser).toHaveBeenCalledWith(101);
//     });

//     it('should log and rethrow error on getUser', async () => {
//       const error = new Error('Failed to get user');
//       jest.spyOn(userRepository, 'getUser').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userService['logger'], 'error');

//       await expect(userService.getUser(1)).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         `Failed to get user with ID 1`,
//         error.stack,
//       );
//     });
//   });

//   describe('updateUser', () => {
//     it('should update a user successfully if user exists', async () => {
//       jest.spyOn(userRepository, 'updateUser').mockResolvedValue({
//         ...mockUser,
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//         lastModifiedAt: new Date(),
//       });

//       await expect(
//         userService.updateUser(1, {
//           username: 'updateduser',
//           email: 'updateduser@example.com',
//         }),
//       ).resolves.toEqual({
//         ...mockUser,
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//         lastModifiedAt: expect.any(Date),
//       });
//       expect(userRepository.updateUser).toHaveBeenCalledWith(1, {
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//       });
//     });

//     it('should throw a NotFoundException if the user does not exist', async () => {
//       jest
//         .spyOn(userRepository, 'updateUser')
//         .mockRejectedValueOnce(new NotFoundException('User not found'));

//       await expect(
//         userService.updateUser(101, {
//           username: 'updateduser',
//           email: 'updateduser@example.com',
//         }),
//       ).rejects.toThrow(NotFoundException);
//       expect(userRepository.updateUser).toHaveBeenCalledWith(101, {
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//       });
//     });

//     it('should log and rethrow error on updateUser', async () => {
//       const error = new Error('Failed to update user');
//       jest.spyOn(userRepository, 'updateUser').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userService['logger'], 'error');

//       await expect(
//         userService.updateUser(1, {
//           username: 'updateduser',
//           email: 'updateduser@example.com',
//         }),
//       ).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         `Failed to update user with ID 1`,
//         error.stack,
//       );
//     });
//   });

//   describe('removeUser', () => {
//     it('should remove the user if user exists', async () => {
//       jest.spyOn(userRepository, 'removeUser').mockResolvedValueOnce(undefined);

//       await expect(userService.removeUser(1)).resolves.toBeUndefined();
//       expect(userRepository.removeUser).toHaveBeenCalledWith(1);
//     });

//     it('should throw a NotFoundException if the user does not exist', async () => {
//       jest
//         .spyOn(userRepository, 'removeUser')
//         .mockRejectedValueOnce(new NotFoundException('User not found'));

//       await expect(userService.removeUser(101)).rejects.toThrow(
//         NotFoundException,
//       );
//       expect(userRepository.removeUser).toHaveBeenCalledWith(101);
//     });

//     it('should log and rethrow error on removeUser', async () => {
//       const error = new Error('Failed to remove user');
//       jest.spyOn(userRepository, 'removeUser').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userService['logger'], 'error');

//       await expect(userService.removeUser(1)).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         `Failed to remove user with ID 1`,
//         error.stack,
//       );
//     });
//   });
// });
