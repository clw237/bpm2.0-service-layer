// import { NotFoundException } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from 'entities';
// import { Logger } from 'kfone-common-library';
// import { UserRepository } from 'repositories';
// import { DeleteResult, Repository } from 'typeorm';
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

// describe('UserRepository', () => {
//   let userRepository: UserRepository;
//   let repository: Repository<User>;
//   let loggerService: LoggerService;
//   let loggerMock: jest.Mocked<Logger>;

//   beforeEach(async () => {
//     loggerService = LoggerService.getInstance();
//     loggerMock = (loggerService as any).logger;
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
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

//     userRepository = module.get<UserRepository>(UserRepository);
//     repository = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   it('should be defined', () => {
//     expect(userRepository).toBeDefined();
//   });

//   describe('createUser', () => {
//     it('should create a new user', async () => {
//       jest.spyOn(repository, 'create').mockReturnValue(mockUser);
//       jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

//       expect(await userRepository.createUser(mockUser)).toEqual(mockUser);
//     });
//   });

//   describe('getAllUsers', () => {
//     it('should return all users', async () => {
//       jest.spyOn(repository, 'find').mockResolvedValue([mockUser]);

//       expect(await userRepository.getAllUsers()).toEqual([mockUser]);
//       expect(repository.find).toHaveBeenCalled();
//     });
//   });

//   describe('getUser', () => {
//     it('should return the user if it exists', async () => {
//       jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);

//       expect(await userRepository.getUser(1)).toEqual(mockUser);
//       expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
//     });

//     it('should throw NotFoundException if user does not exist', async () => {
//       jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

//       await expect(userRepository.getUser(101)).rejects.toThrow(
//         NotFoundException,
//       );
//       expect(repository.findOneBy).toHaveBeenCalledWith({ id: 101 });
//     });

//     it('should log and rethrow error on findOneBy', async () => {
//       const error = new Error('Error');
//       jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userRepository['logger'], 'error');

//       await expect(userRepository.getUser(1)).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         `Failed to get user with ID 1`,
//         expect.any(String),
//       );
//     });
//   });

//   describe('updateUser', () => {
//     it('should update a user successfully if user exists', async () => {
//       jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);
//       jest.spyOn(repository, 'save').mockResolvedValue({
//         ...mockUser,
//         username: 'updateduser',
//         lastModifiedAt: new Date(),
//       });

//       expect(
//         await userRepository.updateUser(1, { username: 'updateduser' }),
//       ).toEqual({
//         ...mockUser,
//         username: 'updateduser',
//         lastModifiedAt: expect.any(Date),
//       });
//       expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
//     });

//     it('should throw a NotFoundException if the user does not exist', async () => {
//       jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

//       await expect(
//         userRepository.updateUser(101, { username: 'updateduser' }),
//       ).rejects.toThrow(NotFoundException);
//       expect(repository.findOneBy).toHaveBeenCalledWith({ id: 101 });
//     });
//   });

//   describe('removeUser', () => {
//     it('should remove the user if user exists', async () => {
//       jest
//         .spyOn(repository, 'delete')
//         .mockResolvedValue({ affected: 1, raw: {} } as DeleteResult);
//       await expect(userRepository.removeUser(1)).resolves.not.toThrow();
//       expect(repository.delete).toHaveBeenCalledWith(1);
//     });

//     it('should throw a NotFoundException if the user does not exist', async () => {
//       jest
//         .spyOn(repository, 'delete')
//         .mockResolvedValue({ affected: 0, raw: {} } as DeleteResult);
//       await expect(userRepository.removeUser(101)).rejects.toThrow(
//         NotFoundException,
//       );
//       expect(repository.delete).toHaveBeenCalledWith(101);
//     });

//     it('should log and rethrow error on delete', async () => {
//       const error = new Error('Error');
//       jest.spyOn(repository, 'delete').mockRejectedValueOnce(error);
//       const loggerSpy = jest.spyOn(userRepository['logger'], 'error');

//       await expect(userRepository.removeUser(1)).rejects.toThrow(error);
//       expect(loggerSpy).toHaveBeenCalledWith(
//         `Failed to remove user with ID 1`,
//         expect.any(String),
//       );
//     });
//   });
// });
