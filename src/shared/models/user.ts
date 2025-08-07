import {randomUUID} from "node:crypto";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import {Credentials, Token, UserCreationProps} from "./types.js";

export class User {
    readonly _id: string;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _password: string;
    readonly _createdAt: string;
    private _updatedAt: string;

    constructor(firstName: string, lastName: string, email: string, password: string) {
        const now = new Date().toISOString()
        this._id = randomUUID()
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._password = password;
        this._createdAt = now;
        this._updatedAt = now;
    }

    public static async register(userData: UserCreationProps): Promise<User> {
        const {firstName, lastName, email, password} = userData;
        const hashedPassword: string = await bcrypt.hash(password, 10)
        return new User(firstName, lastName, email, hashedPassword);
    }

    public static async login(users: User[], credentials: Credentials): Promise<Token> {
        const user = users.find(user => user.email === credentials.email)
        if(!user) throw new Error("The user with specified email was not found")

        const passwordMatch: boolean = await bcrypt.compare(credentials.password, user.password)
        if(!passwordMatch) throw new Error("The password is wrong")

        const accessTokenKey = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET;
        if(!accessTokenKey || !refreshTokenKey) throw new Error("The private key was not found")

        const accessToken = jwt.sign({id: user.id}, accessTokenKey, {expiresIn: '30m'})
        const refreshToken = jwt.sign({id: user.id}, refreshTokenKey, {expiresIn: '30d'})

        return {accessToken, refreshToken}
    }

    get id() {
        return this._id
    }

    get firstName() {
        return this._firstName
    }

    set firstName(firstName: string) {
        if (firstName.length < 3) throw new Error("Specified first name is too short")
        this._firstName = firstName
        this.setUpdatedAt()
    }

    get lastName() {
        return this._lastName
    }

    set lastName(lastName: string) {
        if (lastName.length < 3) throw new Error("Specified last name is too short")
        this._lastName = lastName
        this.setUpdatedAt()
    }

    get email() {
        return this._email
    }

    set email(email: string) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format");
        this._email = email
        this.setUpdatedAt()
    }

    get password() {
        return this._password
    }

    set password(password: string) {
        throw new Error("You should use changePassword() for changing password.")
    }

    get createdAt() {
        return this._createdAt
    }

    get updatedAt() {
        return this._updatedAt
    }

    private setUpdatedAt() {
        this._updatedAt = new Date().toISOString()
    }
}