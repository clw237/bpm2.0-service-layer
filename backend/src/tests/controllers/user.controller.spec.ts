// import {
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { UserController } from 'controllers';
// import { User } from 'entities';
// import { Logger } from 'kfone-common-library';
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

// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserService;
//   let loggerService: LoggerService;
//   let loggerMock: jest.Mocked<Logger>;

//   beforeEach(async () => {
//     loggerService = LoggerService.getInstance();
//     loggerMock = (loggerService as any).logger;
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         UserService,
//         UserRepository,
//         {
//           provide: getRepositoryToken(User),
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     userController = module.get<UserController>(UserController);
//     userService = module.get<UserService>(UserService);
//   });

//   // To verify that the UserController instance has been correctly instantiated and is defined.
//   it('should be defined', () => {
//     expect(userController).toBeDefined();
//   });

//   describe('createUser', () => {
//     it('should create a new user', async () => {
//       jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);
//       const createUserDto = {
//         username: 'testuser',
//         email: 'testuser@example.com',
//       };
//       expect(await userController.createUser(createUserDto)).toEqual(mockUser);
//     });

//     it('should handle exceptions and throw an InternalServerErrorException', async () => {
//       jest
//         .spyOn(userService, 'createUser')
//         .mockRejectedValueOnce(
//           new InternalServerErrorException('Database error'),
//         );
//       const createUserDto = {
//         username: 'testuser',
//         email: 'testuser@example.com',
//       };
//       await expect(userController.createUser(createUserDto)).rejects.toThrow(
//         InternalServerErrorException,
//       );
//     });
//   });

//   describe('getAllUsers', () => {
//     it('should get all users successfully', async () => {
//       jest.spyOn(userService, 'getAllUsers').mockResolvedValueOnce([mockUser]);
//       expect(await userController.getAllUsers()).toEqual([mockUser]);
//     });

//     it('should handle exceptions and throw an InternalServerErrorException', async () => {
//       jest
//         .spyOn(userService, 'getAllUsers')
//         .mockRejectedValueOnce(
//           new InternalServerErrorException('Database error'),
//         );
//       await expect(userController.getAllUsers()).rejects.toThrow(
//         InternalServerErrorException,
//       );
//     });
//   });

//   describe('getUser', () => {
//     it('should return a user by ID if exists', async () => {
//       jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
//       expect(await userController.getUser(1)).toEqual(mockUser);
//     });

//     it('should throw a NotFoundException if user does not exist', async () => {
//       jest
//         .spyOn(userService, 'getUser')
//         .mockRejectedValueOnce(new NotFoundException('User not found'));
//       await expect(userController.getUser(101)).rejects.toThrow(
//         NotFoundException,
//       );
//     });

//     it('should handle other exceptions and throw an InternalServerErrorException', async () => {
//       jest
//         .spyOn(userService, 'getUser')
//         .mockRejectedValueOnce(
//           new InternalServerErrorException('Database error'),
//         );
//       await expect(userController.getUser(101)).rejects.toThrow(
//         InternalServerErrorException,
//       );
//     });
//   });

//   describe('updateUser', () => {
//     it('should update a user successfully if user exists', async () => {
//       const updateUserDto = {
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//       };
//       jest.spyOn(userService, 'updateUser').mockResolvedValue({
//         ...mockUser,
//         ...updateUserDto,
//         lastModifiedAt: new Date(),
//       });
//       expect(await userController.updateUser(1, updateUserDto)).toEqual({
//         ...mockUser,
//         ...updateUserDto,
//         lastModifiedAt: expect.any(Date),
//       });
//     });

//     it('should throw a NotFoundException if the user does not exist', async () => {
//       const updateUserDto = {
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//       };
//       jest
//         .spyOn(userService, 'updateUser')
//         .mockRejectedValueOnce(new NotFoundException('User not found'));
//       await expect(
//         userController.updateUser(101, updateUserDto),
//       ).rejects.toThrow(NotFoundException);
//     });

//     it('should handle other exceptions and throw an InternalServerErrorException', async () => {
//       const updateUserDto = {
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//       };
//       jest
//         .spyOn(userService, 'updateUser')
//         .mockRejectedValueOnce(
//           new InternalServerErrorException('Database error'),
//         );
//       await expect(userController.updateUser(1, updateUserDto)).rejects.toThrow(
//         InternalServerErrorException,
//       );
//     });
//   });

//   describe('removeUser', () => {
//     it('should remove the user if user exists', async () => {
//       jest.spyOn(userService, 'removeUser').mockResolvedValue();
//       await expect(userController.removeUser(1)).resolves.not.toThrow();
//     });

//     it('should throw a NotFoundException if the user does not exist', async () => {
//       jest
//         .spyOn(userService, 'removeUser')
//         .mockRejectedValueOnce(new NotFoundException('User not found'));
//       await expect(userController.removeUser(101)).rejects.toThrow(
//         NotFoundException,
//       );
//     });

//     it('should handle other exceptions and throw an InternalServerErrorException', async () => {
//       jest
//         .spyOn(userService, 'removeUser')
//         .mockRejectedValueOnce(
//           new InternalServerErrorException('Database error'),
//         );
//       await expect(userController.removeUser(1)).rejects.toThrow(
//         InternalServerErrorException,
//       );
//     });
//   });
// });
