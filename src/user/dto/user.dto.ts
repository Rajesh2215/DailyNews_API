import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
export class RegisterDto {

    @IsNotEmpty()
    @ApiProperty({ example: 'Rajesh Bopparthi' })
    name: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'test@mailinator.com' })
    email: string

    @IsNotEmpty()
    @IsPhoneNumber()
    @ApiProperty({ example: 9082345678 })
    phone: number

    @IsNotEmpty()
    @ApiProperty({ example: 'Male' })
    gender: string;

    @IsNotEmpty()
    @ApiProperty({ example: '25' })
    age: number;

    @IsNotEmpty()
    @ApiProperty({ example: 'password' })
    password: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY0BhYmMuY29tMSIsInBhc3N3b3JkIjoicmFqZXNoIiwiaWF0IjoxNjc3NDI3MDY5LCJleHAiOjE2NzgwMzE4Njl9.eK9pX5QL418tjFt3dtAH481ow9K-JhCshu7dNRPBEVk' })
    access_token: string;

}

export class LoginDTO{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'test@mailinator.com' })
    email: string

    @IsNotEmpty()
    @ApiProperty({ example: 'password' })
    password: string;
}