import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

interface ContactInquiry {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendEmail({ to, subject, html, from }: EmailOptions) {
    try {
      const mailOptions = {
        from: from || process.env.SMTP_USER,
        to,
        subject,
        html,
      }

      const result = await this.transporter.sendMail(mailOptions)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async sendAdminNotification(inquiry: ContactInquiry) {
    const subject = `New Contact Inquiry: ${inquiry.subject}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Inquiry</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Inquiry Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 8px 0; color: #6b7280;">${inquiry.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #6b7280;">${inquiry.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 8px 0; color: #6b7280;">${inquiry.subject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date:</td>
                <td style="padding: 8px 0; color: #6b7280;">${new Date(inquiry.created_at).toLocaleString()}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #1f2937;">Message:</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316;">
                ${inquiry.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/contact-inquiries/${inquiry.id}" 
                 style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Panel
              </a>
            </div>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>This is an automated notification from Yamaaraw E-Trike Contact System</p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: 'admin@yamaaraw.com', // Replace with actual admin email
      subject,
      html,
    })
  }

  async sendCustomerConfirmation(inquiry: ContactInquiry) {
    const subject = 'Thank you for contacting Yamaaraw E-Trike'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">Hello ${inquiry.name},</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for reaching out to Yamaaraw E-Trike! We have received your inquiry and our team will get back to you within 24 hours.
            </p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Your Inquiry Summary:</h3>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${inquiry.subject}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(inquiry.created_at).toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Reference ID:</strong> #${inquiry.id.toString().padStart(6, '0')}</p>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>💡 Did you know?</strong> Our electric trikes can save you up to 80% on fuel costs compared to traditional vehicles!
              </p>
            </div>
            
            <div style="margin-top: 30px;">
              <h3 style="color: #1f2937;">Contact Information:</h3>
              <p style="color: #374151; margin: 5px 0;">📧 Email: info@yamaaraw.com</p>
              <p style="color: #374151; margin: 5px 0;">📞 Phone: +63 (02) 123-4567</p>
              <p style="color: #374151; margin: 5px 0;">📱 Mobile: +63 917 123 4567</p>
            </div>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Best regards,<br>The Yamaaraw E-Trike Team</p>
          <p style="margin-top: 15px;">
            <a href="${process.env.NEXT_PUBLIC_LARAVEL_API_URL}" style="color: #f97316;">Visit our website</a> | 
            <a href="${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/products" style="color: #f97316;">View our products</a>
          </p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: inquiry.email,
      subject,
      html,
    })
  }

  async sendReplyEmail(inquiry: ContactInquiry, replyMessage: string, replyFrom: string) {
    const subject = `Re: ${inquiry.subject}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Reply from Yamaaraw E-Trike</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">Hello ${inquiry.name},</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for your patience. Here's our response to your inquiry:
            </p>
            
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="color: #1f2937; margin-top: 0;">Your Original Message:</h4>
              <p style="color: #6b7280; font-style: italic;">"${inquiry.message}"</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                Sent on ${new Date(inquiry.created_at).toLocaleString()}
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              If you have any additional questions, please don't hesitate to contact us again.
            </p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/contact" 
                 style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Contact Us Again
              </a>
            </div>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Best regards,<br>${replyFrom}<br>Yamaaraw E-Trike Team</p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: inquiry.email,
      subject,
      html,
      from: replyFrom,
    })
  }
}

export const emailService = new EmailService()
