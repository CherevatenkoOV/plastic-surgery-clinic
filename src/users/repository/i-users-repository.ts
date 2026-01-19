import {
    CreateUserDto,
    UpdateUserCredentialsDto,
    UpdateUserDto,
    UserAuthSubject,
    UserEntity,
    UserFilter
} from "../types.js";
import {DbClient} from "../../shared/db";

export interface IUsersRepository {
    find(filter?: UserFilter, db?: DbClient): Promise<UserEntity[]>;
    findById(id: string, db?: DbClient): Promise<UserEntity | null>;
    findByEmail(email: string, db?: DbClient): Promise<UserEntity | null>;
    create(createUserDto: CreateUserDto, db: DbClient): Promise<UserEntity>;
    updateProfile(id: string, updateUserDto: UpdateUserDto, db: DbClient): Promise<UserEntity>;
    getAuthSubjectById(id: string, db?: DbClient): Promise<UserAuthSubject | null>;
    getAuthSubjectByEmail(email: string, db?: DbClient): Promise<UserAuthSubject | null>;
    updateCredentials(id: string, updateUserCredentialsDto: UpdateUserCredentialsDto, db: DbClient): Promise<void>;
    delete(id: string, db: DbClient): Promise<void>;
}