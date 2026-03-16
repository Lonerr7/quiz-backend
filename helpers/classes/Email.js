const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const path = require('path');

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

  // async send({testName, userName}) {
  //   const mailOptions = {
  //     from: process.env.MAIL_FROM,
  //     to: process.env.MAIL_TO,
  //     subject: `Новый пройденный тест: ${testName}. Ученик: ${userName}`,
  //     text: "Только что был пройден тест",
  //   };

  //   await this.newTransport().sendMail(mailOptions);
  // }

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