import nodemailer from 'nodemailer';
import { env, isDevelopment } from '../config/environment.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter
const createTransporter = () => {
  if (isDevelopment && (!env.smtp.host || !env.smtp.user)) {
    // In development without SMTP config, log emails to console
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
};

const transporter = createTransporter();

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!transporter) {
      // Development fallback: log to console
      console.log('📧 Email (dev mode):');
      console.log(`   To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log('   Content:', options.text || 'HTML email');
      return true;
    }

    await transporter.sendMail({
      from: `"NightLog" <${env.smtp.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to NightLog</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #12121a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">🌙</div>
                  <h1 style="color: #f8fafc; font-size: 28px; margin: 0; font-weight: 600;">
                    Welcome to NightLog
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px 40px;">
                  <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                    Hi <strong style="color: #f8fafc;">${username}</strong>,
                  </p>
                  <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                    Welcome to NightLog! We're excited to have you join our community of dream explorers.
                  </p>
                  <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                    Start recording your dreams and let our AI help you discover hidden patterns, symbols, and meanings in your subconscious mind.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${env.clientUrl}/dashboard"
                           style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          Start Your Journey
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Features -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 24px;">
                    <tr>
                      <td style="padding: 12px;">
                        <p style="color: #f8fafc; font-size: 14px; margin: 0 0 8px;">✨ <strong>AI Analysis</strong></p>
                        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Discover mood patterns and dream symbols</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px;">
                        <p style="color: #f8fafc; font-size: 14px; margin: 0 0 8px;">📊 <strong>Insights Dashboard</strong></p>
                        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Track trends and visualize your dream data</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px;">
                        <p style="color: #f8fafc; font-size: 14px; margin: 0 0 8px;">🔒 <strong>Private & Secure</strong></p>
                        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Your dreams are encrypted and protected</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: rgba(0,0,0,0.2); text-align: center;">
                  <p style="color: #64748b; font-size: 13px; margin: 0;">
                    Sweet dreams,<br>
                    The NightLog Team
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Welcome to NightLog, ${username}!

We're excited to have you join our community of dream explorers.

Start recording your dreams and let our AI help you discover hidden patterns, symbols, and meanings in your subconscious mind.

Get started: ${env.clientUrl}/dashboard

Sweet dreams,
The NightLog Team
  `;

  return sendEmail({
    to: email,
    subject: '🌙 Welcome to NightLog - Start Your Dream Journey',
    html,
    text,
  });
}
