export interface UserCreationProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface Credentials {
    email: string;
    password: string;
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}