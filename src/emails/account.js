import nodemailer from "nodemailer";
export const sendMailService = async (email, user) => {
  if (process.env.FROM_EMAIL) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: `${email}`,
      subject: `Welcome ${user}`,
      text: "Welcome to Task Manager App",
      html: `<b> Hello ${user}
          <p><img src="https://s3.us-west-2.amazonaws.com/images.unsplash.com/application-1656235607441-22aafc107a59image" alt="welcome"  width="300" height="200"/></p>
      `,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent to : %s", email);
    console.log("Message ID: ", info.messageId);
  }
};

export const removeUserMailService = async (email, user) => {
  if (process.env.FROM_EMAIL) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: `${email}`,
      subject: `GoodBye for now ${user}`,
      text: "Welcome to Task Manager App",
      html: `<b> GoodBye ${user}
          <p>Hope you have enjoyed our Service. </p>
          <p><img src="https://s3.us-west-2.amazonaws.com/images.unsplash.com/application-1656235607441-22aafc107a59image" alt="welcome"  width="300" height="200"/></p>
      `,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent to : %s", email);
    console.log("Message ID: ", info.messageId);
  }
};
