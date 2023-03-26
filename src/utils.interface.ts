import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type utilsDoc = utils & mongoose.Document


@Schema({
    timestamps: true,
    collection: 'utils'
})
export class utils {
    @Prop({
        required: true,
    })
    country:string[]


}
export const UtilsSchema = SchemaFactory.createForClass(utils);