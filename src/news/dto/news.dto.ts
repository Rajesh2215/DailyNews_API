import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NewsDto{
    @IsNotEmpty()
    @ApiProperty({example:'Latest News'})
    name:string

    @IsNotEmpty()
    @ApiProperty({example:'India'})
    country:string
}


export class savedNewsDTO{
    @IsNotEmpty()
    @ApiProperty({example:'Data'})
    email:string

    @IsNotEmpty()
    @ApiProperty({example:'Data'})
    data:{
        id:string,
        name:string,
        author:string,
        title:string,
        url:string,
        urlToImage:string,
        publishedAt:string,
        content:string,
        createdAt:Date
    }

}