require('dotenv').config({ path: '../.env' });

const sendEmail = require('./config/mail');

sendEmail({
  email: 'intelect23235@gmail.com',
  subject: 'SMTP test ✅',
  message: '<h1>Email works!</h1>',
})
  .then(() => {
    console.log('✅ Email sent');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Email error:', err.message);
    process.exit(1);
  });
