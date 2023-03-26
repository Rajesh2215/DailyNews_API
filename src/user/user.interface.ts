import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type userDoc = user & mongoose.Document


@Schema({
    timestamps:true,
    collection:'Users'
})
export class user{
    @Prop({
        required:true,
    })
    name:string

    @Prop({
        required:true,
        unique:true

    })
    email:string

    @Prop({
        required:true,
        unique:true
    })
    phone:string

    @Prop({
        required:true
    })
    gender:string

    @Prop({
        required:true
    })
    age:string

    @Prop({
        required:true
    })
    password:string

    @Prop({
        required:true
    })
    access_token:string
}
export const UserSchema = SchemaFactory.createForClass(user);
UserSchema.index({ email: 1, phone: 1 }, { unique: true });