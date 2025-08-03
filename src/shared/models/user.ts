import {randomUUID} from "node:crypto";

interface UserProps {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

export class User {
    private _firstName: string;
    private _lastName: string;
    readonly _id: string;
    readonly _createdAt: string;
    private _updatedAt: string;

    constructor(firstName: string, lastName: string) {
        const now = new Date().toISOString()
        this._id = randomUUID()
        this._firstName = firstName;
        this._lastName = lastName;
        this._createdAt = now;
        this._updatedAt = now;
    }

    get id() {
        return this._id
    }

    get firstName(){
        return this._firstName
    }
    set firstName(firstName: string){
        if(firstName.length < 3) throw new Error("Specified first name is too short")
        this._firstName = firstName
        this.setUpdatedAt()
    }

    get lastName(){
        return this._lastName
    }
    set lastName(lastName: string){
        if(lastName.length < 3) throw new Error("Specified last name is too short")
        this._lastName = lastName
        this.setUpdatedAt()
    }

    get createdAt(){
        return this._createdAt
    }
    get updatedAt(){
        return this._updatedAt
    }

   private setUpdatedAt(){
       this._updatedAt = new Date().toISOString()
    }
}