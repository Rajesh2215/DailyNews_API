import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import { userDoc } from './user.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(@InjectModel('user')
    private readonly userModel: Model<userDoc>,
        private jwtService: JwtService) { }


    async register(userBody) {
        try {
            const checkemail = await this.userModel.findOne({ email: userBody.email })
            if (checkemail) {
                console.log('User Already exist')
                // throw new HttpException('User Already Exists in DB', HttpStatus.BAD_REQUEST)
                throw new Error('User Already Exists')
            }
            const checkphone = await this.userModel.findOne({ phone: userBody.phone })
            if (checkphone) {
                throw new HttpException('Phone number already Registerd', HttpStatus.BAD_GATEWAY)
            }

            const saltOrRounds = 10;
            const password = userBody.password;
            const hash = await bcrypt.hash(password, saltOrRounds);

            userBody.password = hash
            const access_token = this.jwtService.sign(userBody, { secret: process.env.JWTSECRET, algorithm: 'HS256' });

            const res = await this.userModel.create({ ...userBody, password: hash, access_token: access_token })
            console.log('User Created successfully', res)
            return {
                access_token: access_token,
                message: 'User Registered Successfully',
                success: true,
                status: HttpStatus.OK
            };
        } catch (error) {
            console.log('Error=>', error.message)
            return error.message
        }
    }

    async login(payload) {
        try {
            let user = await this.userModel.findOne({ email: payload.email })
            console.log('user', user)
            if (!user) {
                throw new NotFoundException('Invalid Username or Password')
            }
            const result = await bcrypt.compareSync(payload.password, user.password);

            if (!result) {
                throw new NotFoundException('Invalid email or password');
            }
            const access_token = this.jwtService.sign(payload, { secret: process.env.JWTSECRET, algorithm: 'HS256' });
            await this.userModel.updateOne({ email: payload.email }, { $set: { access_token: access_token } });

            return {
                access_token: user.access_token,
                message: 'User Logged in Successfully',
                success: true,
                status: HttpStatus.OK,
                data:user,
            };
        }
        catch (error) {
            console.log('Error = >', error.message)
            throw new BadRequestException(error.message)
            return error
            // return {
            //     message:error.message,
            //     status:HttpStatus.UNAUTHORIZED,
            //     success:false,
            //     data:error.message
            // }
        }
    }

    async refreshToken(payload) {
        try {
            // Verify the refresh token
            const decoded = this.jwtService.verify(payload.access_token, { secret: 'your-secret-key' });
            // Check if the access token has expired
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decoded.exp > currentTimestamp) {
                console.log('checking time')
                return true
            }
            const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
            await this.userModel.updateOne({ email: payload.email }, { $set: { access_token: accessToken } });
        }
        catch (error) {
            console.log('error', error)
        }
    }


    async delete(email) {
        try {
            const checkemail = await this.userModel.findOne({ email: email })
            if (!checkemail) {
                throw new NotFoundException('User Not found')
            }
            await this.userModel.deleteOne({ email })
            console.log('User deleted successfuly')
            return
        }
        catch (error) {
            console.log(error.message)
            throw new NotFoundException(error.message)
        }
    }

    async usercheck(request) {
        try {
            console.log('Checking user funtion')
            const checkemail = await this.userModel.findOne({ email: request.email });
            if (checkemail) {
                console.log('Email Exists')
                throw new Error('Email Already Exists');
            }
            const checkphone = await this.userModel.findOne({ phone: request.phone });
            if (checkphone) {
                throw new Error('Phone number already Registerd');
            }
            return {
                status: HttpStatus.OK
            }; // Return null if no errors
        } catch (error) {
            console.log('error in service', error.message);
            throw new BadRequestException(error.message)
            return {
                status:HttpStatus.BAD_REQUEST,
                message:error.message,
                data:error
            }
        }
    }

}