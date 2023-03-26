import { Controller, Injectable, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import * as NodeCache from 'node-cache';
import { MailService } from './mail.service';
import * as otpGenerator from 'otp-generator';
import { Request, Response } from 'express';
@Injectable()
@ApiTags('mail')
@Controller('mail')
export class MailController {
  private readonly otpCache = new NodeCache();

  constructor(private readonly mailService: MailService) { }
  @ApiCreatedResponse({ description: "Latest News" })
  @Post('/sendOtp')
  async SendOtp(@Req() request: Request, @Res() res: Response): Promise<void> {
    console.log('API_CALL=>', {
      'request user id': '',
      'request body': request.body,
      api: `sendOtp`,
  });
    let data = request.body
    let otp;
    try {
      const subject = 'Your OTP for Signup';
      otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
      const cache = this.otpCache.set(data?.email, otp);
      const text = `Your OTP for signup is: ${otp}`;
      const value = await this.mailService.sendEmail(data.email, subject, text);
    }
    catch (error) {
      console.log('error', error)
    }
    finally {
      console.log('otp', otp)
      return otp
    }
  }


  @ApiCreatedResponse({ description: "Latest News" })
  @Post('/verifyCode')
  async verifyOtp(@Req() request: Request, @Res() res: Response): Promise<void> {
    console.log('API_CALL=>', {
      'request user id': '',
      'request body': request.body,
      api: `verifyCode`,
  });
    let a = Object.keys(request.body)
    let receivedOtp = a[0]
    const userDataHeader = request.headers.userdata;
    const userData = Array.isArray(userDataHeader) ? userDataHeader[0] : userDataHeader;
    const userDataObj = typeof userData === 'string' ? JSON.parse(userData) : {};
    const email = userDataObj.email;
    let verified = false
    try {
      const otpCache = new NodeCache();
      const expectedOtp = this.otpCache.get(email);
      console.log('expectedOtp', expectedOtp)
      if (expectedOtp === receivedOtp) {
        otpCache.del(email); // remove the OTP from cache after successful verification
        verified = true;
        res.status(200).send('OTP Verified');
      } else {
        verified = false;
        res.status(400).send('Invalid OTP');
      }
      console.log('verified', verified)

    }
    catch (error) {
      console.log('error', error)
      res.status(500).send('Error verifying OTP');
    }

  }
}
