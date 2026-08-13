export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

export type LoginResponse = User & {
  accessToken: string;
  refreshToken: string;
};
