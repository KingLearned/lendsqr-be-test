// import httpMocks from 'node-mocks-http';
// import { Validator } from '../../utils/validator';
// import { AuthHelper } from '../../middlewares/Authenticator';
// import DB from '../../config/db';
// import { WalletServices } from '../../services/walletService';
// import hashHelper from '../../utils/password_hash';

// jest.mock('../../config/db', () => {
//   const dbFn = jest.fn();
//   return {
//     __esModule: true,
//     default: dbFn,
//   };
// });

// export const mockUser = {
//   id: 3,
//   email: 'testm@example.com',
//   password: 'abc12345',
//   firstname: 'John',
//   lastname: 'Doe',
//   phone: '08012385678',
//   bvn: '12345678601',
// };

// export const loginData = {
//   email: mockUser.email,
//   password: 'Pass1234!',
// };

// export function createMockReqRes(body: any = {}, userId: number = 3) {
//   const req = httpMocks.createRequest({
//     method: 'POST',
//     body,
//   });
//   const res = httpMocks.createResponse();
//   res.locals = { user: { user: { id: userId } } };
//   return { req, res };
// }
// // Mocking the Validator methods
// export function mockRegisterValidators(overrides: Partial<Record<string, any>> = {}) {
//   jest.spyOn(Validator, 'isEmailValid').mockReturnValue(overrides.isEmailValid ?? false);
//   jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(overrides.isPhoneNumberValid ?? false);
//   jest.spyOn(Validator, 'isBvnValid').mockReturnValue(overrides.isBvnValid ?? false);
//   jest.spyOn(Validator, 'checkEmailExist').mockResolvedValue(overrides.checkEmailExist ?? false);
//   jest.spyOn(Validator, 'checkPhoneExist').mockResolvedValue(overrides.checkPhoneExist ?? false);
//   jest.spyOn(Validator, 'checkBvnExist').mockResolvedValue(overrides.checkBvnExist ?? false);
// }
// // Mocking the DB methods
// // export function mockDBInsertAndFind(user = mockUser) {
// //   const dbWhereMock = jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue(user) });
// //   jest.spyOn(DB, 'insert').mockResolvedValue([user.id] as any);
// //   jest.spyOn(DB, 'where').mockImplementation(dbWhereMock as any);
// // }
// export function mockDBInsertAndFind(user = mockUser) {
//   const dbMock = {
//     insert: jest.fn().mockResolvedValue([user.id]),
//     where: jest.fn().mockReturnValue({
//       first: jest.fn().mockResolvedValue(user),
//     }),
//   };

//   (DB as unknown as jest.Mock).mockImplementation(() => dbMock);
// }

// // Mocking the Wallet and Auth methods
// export function mockWalletAndAuth() {
//   jest.spyOn(WalletServices, 'createWallet').mockResolvedValue(undefined);
//   jest.spyOn(AuthHelper, 'signJwt').mockReturnValue('jwt-token-123');
// }
// // Mocking the Password Hashing methods
// export function mockPasswordHelpers() {
//   jest.spyOn(hashHelper, 'hashPassword').mockResolvedValue('hashedPassword123');
//   jest.spyOn(hashHelper, 'comparePassword').mockResolvedValue(true);
// }

// export function clearAllSpies() {
//   jest.clearAllMocks();
//   jest.resetModules(); 
//   jest.restoreAllMocks();
// }
