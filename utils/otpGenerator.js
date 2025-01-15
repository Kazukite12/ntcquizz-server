
const nodemailer = require('nodemailer');



const generateOtp = () =>  {
   return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password or app password
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Kode OTP Pendafataran Akun NtcQuizz',
    text: `Kode OTP Pendafataran Akun NtcQuizz Anda Adalah ${otp}. Kode OTP Berlaku Selama 5 Menit.`,
  };

  await transporter.sendMail(mailOptions);
};

const sendOtpInBackground = async (email, otp) => {
    try {
      await sendOtpEmail(email, otp);
      console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Failed to send OTP email to ${email}:`, error);
      // Optionally, log this to a monitoring system
    }
  };

module.exports = { generateOtp,sendOtpEmail,sendOtpInBackground};