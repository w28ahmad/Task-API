const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

/* 
Signup Welcome Email
Welcomes the user to our service
*/
const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'w28ahmad@uwaterloo.ca',
        subject: 'Thanks for joining',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

/* 
Exit email
If the user decides to quit our service by deleting their account this goodBye email is sent
*/
const GoodbyeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'w28ahmad@uwaterloo.ca',
        subject: 'GoodBye',
        text: `Goodbye, ${name}. Is there anything we could of done to keep you onboard?`
    })
}

module.exports = {
    sendWelcomeEmail,
    GoodbyeEmail
}