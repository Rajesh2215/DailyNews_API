To Run the project 


npm i

Create a .env
Get your API key from  Google News : https://newsapi.org/s/google-news-in-api
and paste in env

Required an email account for SMTP (for OTP)
If two step verifcation enabled for gmail account , then you have to create password for it
Go to your Google Account Security page.
Under the "Signing in to Google" section, click on "App passwords".
Select the app you want to generate the App Password for (in this case, "Mail").
Select the device you want to use the App Password for.
Click "Generate".
Google will generate a 16-digit code for you to use. This code will only be shown once, so be sure to copy it or download it and save it somewhere secure.
Use this code as the SMTP password in your .env file



npm run start:dev


