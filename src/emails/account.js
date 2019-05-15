const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'w28ahmad@uwaterloo.ca',
        subject: 'Thanks for joining',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const GoodbyeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'w28ahmad@uwaterloo.ca',
        subject: 'GoodBye',
        text: `Goodbye, ${name}. Is there anything we could of done to keep you keep you onboard?`
    })
}

module.exports = {
    sendWelcomeEmail,
    GoodbyeEmail
}