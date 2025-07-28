import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hash password before storing it in the database
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Unhashed password comparison
export const comparePassword = async (Password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(Password, hashedPassword);
};