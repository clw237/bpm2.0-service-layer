// import { Logger, LogLevel } from 'kfone-common-library';
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

// describe('LoggerService', () => {
//   let loggerService: LoggerService;
//   let loggerMock: jest.Mocked<Logger>;

//   beforeEach(() => {
//     //loggerService = LoggerService.getInstance();
//     loggerMock = (loggerService as any).logger;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create an instance of LoggerService', () => {
//     expect(loggerService).toBeInstanceOf(LoggerService);
//   });

//   it('should use the same instance for multiple calls to getInstance', () => {
//    // const anotherInstance = LoggerService.getInstance();
//    // expect(loggerService).toBe(anotherInstance);
//   });

//   it('should call Logger.log when log is called', () => {
//     const message = 'Test log message';
//     const logLevel = LogLevel.INFO;
//     const optionalParams = ['param1', 'param2'];

//     //loggerService.log(message, logLevel, ...optionalParams);

//     expect(loggerMock.log).toHaveBeenCalledWith(
//       message,
//       logLevel,
//       ...optionalParams,
//     );
//   });

//   it('should call Logger.info when info is called', () => {
//     const message = 'Test info message';
//     const optionalParams = ['param1', 'param2'];

//     loggerService.info(message, ...optionalParams);

//     expect(loggerMock.info).toHaveBeenCalledWith(message, ...optionalParams);
//   });

//   it('should call Logger.debug when debug is called', () => {
//     const message = 'Test debug message';
//     const optionalParams = ['param1', 'param2'];

//     loggerService.debug(message, ...optionalParams);

//     expect(loggerMock.debug).toHaveBeenCalledWith(message, ...optionalParams);
//   });

//   it('should call Logger.warn when warn is called', () => {
//     const message = 'Test warn message';
//     const optionalParams = ['param1', 'param2'];

//     loggerService.warn(message, ...optionalParams);

//     expect(loggerMock.warn).toHaveBeenCalledWith(message, ...optionalParams);
//   });

//   it('should call Logger.error when error is called', () => {
//     const message = 'Test error message';
//     const optionalParams = ['param1', 'param2'];

//     loggerService.error(message, ...optionalParams);

//     expect(loggerMock.error).toHaveBeenCalledWith(message, ...optionalParams);
//   });
// });
