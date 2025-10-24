import { LoginCredentials } from '../interfaces/login-credentials';
import { readJson } from '../utils/dataReader';

interface UsersData {
  VALID_USER: LoginCredentials;
}

const usersData = readJson<UsersData>('data/users.json');

export const VALID_USER: LoginCredentials = usersData.VALID_USER;

export const USERS = {
  VALID_USER,
};
