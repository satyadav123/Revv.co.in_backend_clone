let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({

    service:'gmail',
    auth: {
        user: 'clonerevv@gmail.com',
        pass: 'Revv@123'
    }
  });

  module.exports = {transporter}
  
  