const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND,
);

//send mail
const sendEMail = (to, url, username, txt) => {
    console.log(url);
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'long47004@donga.edu.vn',
            pass: process.env.PASS_EMAIL,
            clientId: 'CLIENT_ID_HERE',
            clientSecret: 'CLIENT_SECRET_HERE',
            refreshToken: 'REFRESH_TOKEN_HERE',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: 'DongA FB',
        html: `<h2>Xin cảm ơn bạn ${username} đã chọn dịch vụ của chúng tôi</h2>
                <h4>Vui lòng bấm vào đường link ở dưới để tiếp tục sử dụng dịch vụ của chúng tôi 🥰</h4>
                <a href=${url}>${txt}</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Verfication email is sent to your gmail account');
        }
    });
};

module.exports = sendEMail;
