// Define a User interface for general user properties
export interface UserData {
  name: string;
  email: string;
  password: string;
}

// Define an interface specifically for authentication
export interface ResponseAuthUser extends UserRequestData {
  id: number;
  name: string;
}

export interface UserRequestData {
  name: string;
  email: string;
  password: string;
}
