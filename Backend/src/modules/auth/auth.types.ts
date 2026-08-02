export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  
}

export interface RegisterResponse {
  accessToken?: string;
  refreshToken?: string;
  userId: {
    id: string;
    name: string;
  }
}



