const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const path = require('path');

module.exports = class Email {
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });
  }

  async send(templateData) {
    const { testName, userName } = templateData;

    // Рендер и инлайнинг стилей
    const html = pug.renderFile(
      path.join(__dirname, '../../views/email/testResult.pug'),
      templateData
    );
    const inlinedHtml = juice(html);

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Результат: ${testName} — ${userName}`,
      html: inlinedHtml,
      text: `Тест: ${testName}. Ученик: ${userName}. Результат: ${templateData.correctAnswersCount}/${templateData.checkedQuestions.length}`
    };

    await this.newTransport().sendMail(mailOptions);
  }
}