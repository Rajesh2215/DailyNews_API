import { Controller, Get, Post, Injectable, Body, Req, Param, BadRequestException, Res, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { LoginDTO, RegisterDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Request, response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }


    @ApiCreatedResponse({ description: "Create New User" })
    @ApiBody({ type: RegisterDto })
    @Post('/register')
    async register(@Body() body: RegisterDto) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': body,
            api: `register`,
        });
        let ObjectId = new mongoose.Types.ObjectId();
        const userBody: any = {
            ...body,
            _id: ObjectId
        }
        return await this.userService.register(userBody)
    }


    @ApiCreatedResponse({ description: "Login a user" })
    @ApiBody({ type: LoginDTO })
    @Post('/login')
    async login(@Res() res: Response, @Body() body: LoginDTO) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': body,
            api: `login`,
        });
        try {
            let payload: any = {
                ...body
            }
            const response = await this.userService.login(payload)
            console.log('response==>', response.data)
            return res.status(response.status).send({
                access_token: response.access_token,
                status: response.status,
                email: response.data,
                statusText: 'User logged in successfully'
            });
        } catch (error) {
            console.log('error in login', error.message)
            throw new BadRequestException(error.message);
        }
    }


    @ApiCreatedResponse({ description: "Delete a user" })
    @Get('/delete/:email?')
    async delete(@Param('email') email: string) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': email,
            api: `delete`,
        });
        console.log('request.body to delete',email)
        return await this.userService.delete(email)
    }

    @ApiCreatedResponse({ description: "Check a user exists or not" })
    @Post('/checkUser')
    async checkUser(@Req() request: Request, @Res() res: Response) {
        console.log('API_CALL=>', {
            'request user id': '',
            'request body': '',
            api: `checkUser`,
        });
        try{
            console.log('requesting', request.body)
            const response = await this.userService.usercheck(request.body)
            return res.status(response.status).send({
                data:response.data,
                status: response.status,
                statusText: response.message
            });
        }
        catch(error){
            throw new BadRequestException(error.message)
        }
    }

}
