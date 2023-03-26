import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as NodeCache from 'node-cache';

@Injectable()
export class MailService {
  private readonly transporter
  constructor() {

    this.transporter = nodemailer.createTransport({
      host: "my.smtp.host",
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Disable certificate verification
      }
    });
  }




  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpCache = new NodeCache();

    const expectedOtp = otpCache.get(email);
    if (expectedOtp === otp) {
      otpCache.del(email); // remove the OTP from cache after successful verification
      return true;
    } else {
      return false;
    }
  }

  async sendEmail(to: string, subject: string, text: string) {
   await this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    console.log('Sending Mail')
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    };

    return this.transporter.sendMail(mailOptions);
  }

}
