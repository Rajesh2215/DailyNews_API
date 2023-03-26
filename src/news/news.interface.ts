import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Collection } from "mongoose";


export type newsDoc = news & mongoose.Document
export type savedNewsDoc = savedNews & mongoose.Document


@Schema({
    timestamps: true,
    collection: 'News'
})
export class news {
    @Prop({})
    id: string
    
    @Prop({})
    name: string

    @Prop({})
    author: string

    @Prop({})
    title: string

    @Prop({})
    url: string

    @Prop({})
    urlToImage: string

    @Prop({})
    publishedAt: string

    @Prop({})
    content: string
}


@Schema({
    timestamps:true,
    collection:'savedNews'
})
export class savedNews{
    @Prop({})
    id:string
    
    @Prop({})
    userEmail:string

    @Prop({type:Object})
    source:{
        id:string,
        name:string
    }
    
    @Prop({})
    author:string
    
    @Prop({})
    title:string
    
    @Prop({})
    url:string
    
    @Prop({})
    urlToImage:string
    
    @Prop({})
    publishedAt:string
    
    @Prop({})
    content:string
    
    @Prop({})
    createdAt:Date
    
}



export const savedNewSchema = SchemaFactory.createForClass(savedNews)
savedNewSchema.index({ title:1}, { unique: true });

export const NewsSchema = SchemaFactory.createForClass(news)
NewsSchema.index({ title:1}, { unique: true });