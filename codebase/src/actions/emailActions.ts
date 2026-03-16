'use server';

import nodemailer from 'nodemailer';

interface EmailOptions {
  subject: string;
  message: string;
  attachmentPath?: string;
  attachmentName?: string;
}

/**
 * Server Action zum Senden einer E-Mail an den Admin
 * Diese Funktion läuft auf dem Server, auch wenn sie vom Client aufgerufen wird
 */
export async function sendAdminEmail({
  subject,
  message,
  attachmentPath,
  attachmentName
}: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Get admin email from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error('Admin email not configured in environment variables');
    }

    if (!subject || !message) {
      throw new Error('Subject and message are required');
    }

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // This should be an app password for Gmail
      },
    });

    // Email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: subject,
      text: message,
    };

    // Add attachment if provided
    if (attachmentPath && attachmentName) {
      mailOptions.attachments = [
        {
          filename: attachmentName,
          path: attachmentPath
        }
      ];
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}
