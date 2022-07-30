const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY2 } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY2);


const sendMail = async (data) => {
    const message = { ...data, from: 'akhardin96@gmail.com' };
    await sgMail.send(message)
        .then(() => { console.log("Message sent successfully") })
        .catch(err => { return console.error(err) });
    return true;
};

module.exports = sendMail;