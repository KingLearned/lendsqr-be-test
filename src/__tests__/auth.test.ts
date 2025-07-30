
import httpMocks from 'node-mocks-http';
import AuthController from '../controllers/authController';
import Validator from '../utils/validator';
import WalletServices from '../services/walletService';
import DB from '../config/db'; 
import * as hashHelper from '../utils/password_hash';
import * as AuthHelper from '../middlewares/Authenticator';

jest.mock('../config/db', () => {
  const dbFn = jest.fn();
  return {
    __esModule: true,
    default: dbFn,
  };
});

// Registration test
describe('AuthController - registerUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user successfully', async () => {
        // Mock request and response
        const req = httpMocks.createRequest({
        method: 'POST',
        body: {
            email: 'abc@example.com',
            password: 'Pass1234!',
            firstName: 'John',
            lastName: 'Doe',
            phone: '08068345678',
            bvn: '25687963254',
        },
        });

        const res = httpMocks.createResponse();
        const mockUserId = 2;

        // Validator functions to pass all validations
        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isBvnValid').mockReturnValue(true);
        jest.spyOn(Validator, 'checkEmailExist').mockResolvedValue(false);
        jest.spyOn(Validator, 'checkPhoneExist').mockResolvedValue(false);
        jest.spyOn(Validator, 'checkBvnExist').mockResolvedValue(false);

        // Mock password hashing
        jest.spyOn(hashHelper, 'hashPassword').mockResolvedValue('hashed1234!');

        // Mock DB chainable calls
        const dbMock = {
            insert: jest.fn().mockResolvedValue([mockUserId]),
            where: jest.fn().mockReturnValue({
                first: jest.fn().mockResolvedValue({ id: mockUserId, email: 'abc@example.com' }),
            }),
        };

        // Return mocked DB chain
        (DB as unknown as jest.Mock).mockImplementation(() => dbMock);

        // Mock wallet creation and JWT
        jest.spyOn(WalletServices, 'createWallet').mockResolvedValue(undefined);
        jest.spyOn(AuthHelper.default, 'signJwt').mockReturnValue('token123');

        // Call controller
        await AuthController.registerUser(req, res);

        // Assertions
        const json = res._getJSONData();
        expect(res.statusCode).toBe(201);
        expect(json.success).toBe(true);
        expect(json.token).toBe('token123');

        // Extra: Verify mocks called as expected
        expect(dbMock.insert).toHaveBeenCalled();
        expect(WalletServices.createWallet).toHaveBeenCalledWith(mockUserId);
        expect(AuthHelper.default.signJwt).toHaveBeenCalled();
    });
    
    it('should fail when required fields are missing', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            bvn: '',
            },
        });

        const res = httpMocks.createResponse();

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('All fields are required!');
    });

    it('should fail on invalid email format', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
            email: 'johndoe@',
            password: 'Pass1234!',
            firstName: 'John',
            lastName: 'Doe',
            phone: '08068345678',
            bvn: '25687963254',
            },
        });

        const res = httpMocks.createResponse();

        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(false);

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Invalid email format!');
    });

    it('should fail on invalid phone number format', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'abc@example.com',
                password: 'Pass1234!',
                firstName: 'John',
                lastName: 'Doe',
                phone: '12345', 
                bvn: '25687963254',
            },
        });

        const res = httpMocks.createResponse();

        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(false);

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Invalid phone number format!');
    });

    it('should fail on invalid bnv format', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'abc@example.com',
                password: 'Pass1234!',
                firstName: 'John',
                lastName: 'Doe',
                phone: '08068345678', 
                bvn: '256879632BNC',
            },
        });

        const res = httpMocks.createResponse();

        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(true); 
        jest.spyOn(Validator, 'isBvnValid').mockReturnValue(false); 

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Invalid BVN format!');
    });

    it('should fail if phone number already exists', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'abc@example.com',
                password: 'Pass1234!',
                firstName: 'John',
                lastName: 'Doe',
                phone: '08068345678', 
                bvn: '25687963254',
            },
        });

        const res = httpMocks.createResponse();

        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(true); 
        jest.spyOn(Validator, 'isBvnValid').mockReturnValue(true);
        jest.spyOn(Validator, 'checkPhoneExist').mockResolvedValue(true); 

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Phone number is already in use!');
    });

    it('should fail if email already exists', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'abc@example.com',
                password: 'Pass1234!',
                firstName: 'John',
                lastName: 'Doe',
                phone: '08068345678', 
                bvn: '25687963254',
            },
        });

        const res = httpMocks.createResponse();

        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(true); 
        jest.spyOn(Validator, 'isBvnValid').mockReturnValue(true);
        jest.spyOn(Validator, 'checkPhoneExist').mockResolvedValue(false);
        jest.spyOn(Validator, 'checkEmailExist').mockResolvedValue(true); 

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Email is already in use!');
    });

    it('should fail if bvn already exists', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'abc@example.com',
                password: 'Pass1234!',
                firstName: 'John',
                lastName: 'Doe',
                phone: '08068345678', 
                bvn: '25687963254',
            },
        });

        const res = httpMocks.createResponse();

        jest.spyOn(Validator, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(Validator, 'isPhoneNumberValid').mockReturnValue(true); 
        jest.spyOn(Validator, 'isBvnValid').mockReturnValue(true);
        jest.spyOn(Validator, 'checkPhoneExist').mockResolvedValue(false);
        jest.spyOn(Validator, 'checkEmailExist').mockResolvedValue(false); 
        jest.spyOn(Validator, 'checkBvnExist').mockResolvedValue(true);

        await AuthController.registerUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('BVN is already in use!');
    });
});

// Login test
describe('AuthController - loginUser', () => {

    const setup = (body: any) => {
        const req = httpMocks.createRequest({
            method: 'POST',
            body,
        });
        const res = httpMocks.createResponse();
        return { req, res };
    };

    it('should log in a user successfully', async () => {
    
        const req = httpMocks.createRequest({
            method: 'POST',
            body: {
                email: 'abc@example.com',
                password: 'Pass1234!',
            },
        });
        const res = httpMocks.createResponse();

        const mockUser = {
            id: 1,
            email: 'abc@example.com',
            password: '$2b$10$FakeHashedPassword1234567890',
            firstName: 'John',
            lastName: 'Doe',
        };

        (DB as unknown as jest.Mock).mockImplementation((table: string) => {
            if (table === 'users') {
                return {
                where: jest.fn().mockReturnValue({
                    first: jest.fn().mockResolvedValue(mockUser),
                }),
                };
            }
            return {};
        });


        jest.spyOn(hashHelper, 'comparePassword').mockResolvedValue(true);
        jest.spyOn(AuthHelper.default, 'signJwt').mockReturnValue('mocked-jwt-token');

        await AuthController.loginUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(json.success).toBe(true);
        expect(json.token).toBe('mocked-jwt-token');
        expect(json.user.email).toBe('abc@example.com');
    });

    it('should fail when email or password is missing', async () => {
        const { req, res } = setup({ email: '', password: '' });

        await AuthController.loginUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Email and password are required!');
    });

    it('should fail if user is not found', async () => {
        const { req, res } = setup({ email: 'notfound@example.com', password: 'somepass' });

        const dbMock = {
        where: jest.fn().mockReturnValue({
            first: jest.fn().mockResolvedValue(null),
        }),
        };
        (DB as unknown as jest.Mock).mockImplementation(() => dbMock);

        await AuthController.loginUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Invalid credentials!');
    });

    it('should fail if password does not match', async () => {
        const { req, res } = setup({ email: "abc@example.com", password: 'wrongpass' });

        const dbMock = {
        where: jest.fn().mockReturnValue({
            first: jest.fn().mockResolvedValue(
                {
                    id: 2,
                    email: 'abc@example.com',
                    password: '$2b$10$FakeHashedPassword1234567890',
                    firstName: 'John',
                    lastName: 'Doe',
                }
            ),
        }),
        };
        (DB as unknown as jest.Mock).mockImplementation(() => dbMock);

        jest.spyOn(hashHelper, 'comparePassword').mockResolvedValue(false);

        await AuthController.loginUser(req, res);

        const json = res._getJSONData();
        expect(res.statusCode).toBe(400);
        expect(json.success).toBe(false);
        expect(json.message).toBe('Invalid credentials!');
    });
});