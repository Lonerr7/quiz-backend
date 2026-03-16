const nodemailer = require('nodemailer');

module.exports = class Email {
  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.GOOGLE_APP_PASSWORD,
      }
    });
  }

  async send() {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: 'Новый пройденный тест',
      text: "Только что был пройден тест",
    };

    await this.newTransport().sendMail(mailOptions);
  }
}