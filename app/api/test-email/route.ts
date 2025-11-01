import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    console.log("Testing SMTP connection...")
    console.log("SMTP_HOST:", process.env.SMTP_HOST)
    console.log("SMTP_PORT:", process.env.SMTP_PORT)
    console.log("SMTP_USER:", process.env.SMTP_USER)
    console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS)

    // E-posta gönder
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Test connection
    await transporter.verify()
    console.log("SMTP connection verified successfully!")

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'FastReado - SMTP Test',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2>SMTP Test Başarılı!</h2>
          <p>Bu e-posta FastReado SMTP test sistemi tarafından gönderilmiştir.</p>
          <p>Tarih: ${new Date().toLocaleString('tr-TR')}</p>
        </div>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)

    return NextResponse.json({ 
      success: true,
      message: "Test email sent successfully",
      messageId: result.messageId
    })

  } catch (error) {
    console.error("SMTP test error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}