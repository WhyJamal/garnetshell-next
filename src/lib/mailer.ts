import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: { user, pass },
  });

  return transporter;
}

async function sendMail(to: string, subject: string, html: string) {
  const t = getTransporter();

  if (!t) {
    console.warn(
      `[mailer] SMTP sozlanmagan (.env dagi SMTP_HOST/SMTP_USER/SMTP_PASS). ` +
        `"${to}" ga yuborilishi kerak bo'lgan xat:\n${html}`
    );
    return;
  }

  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(to: string, code: string) {
  await sendMail(
    to,
    "Narsil — код подтверждения email",
    `<div style="font-family:sans-serif;font-size:15px;color:#111">
      <p>Чтобы завершить регистрацию, введите этот код:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
      <p style="color:#666">Код действителен ${process.env.OTP_TTL_MINUTES ?? 10} минут. Если вы не делали этот запрос — просто проигнорируйте письмо.</p>
    </div>`
  );
}

export async function sendPasswordResetEmail(to: string, code: string) {
  await sendMail(
    to,
    "Narsil — код для сброса пароля",
    `<div style="font-family:sans-serif;font-size:15px;color:#111">
      <p>Чтобы сбросить пароль, введите этот код:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
      <p style="color:#666">Код действителен ${process.env.OTP_TTL_MINUTES ?? 10} минут. Если вы не делали этот запрос — просто проигнорируйте письмо.</p>
    </div>`
  );
}
