const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY) //set api key

/**
 * Sends an email message to users signing up for the first time
 * @param {email address passed from create user} email 
 * @param {name passed from create user} name 
 */
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bryan.odonoghue@cdw.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

/**
 * Function that sends an email to users leaving concert app service
 * @param {email address passed from create user} email 
 * @param {name passed from create user} name 
 */
const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bryan.odonoghue@cdw.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })
}

//export functions to other files
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}