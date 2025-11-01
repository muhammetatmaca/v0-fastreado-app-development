import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import crypto from "crypto"
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

    await connectDB()

    // Kullanıcıyı bul
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      // Güvenlik için kullanıcı bulunamasa bile başarılı mesaj döndür
      return NextResponse.json({ 
        message: "If an account with that email exists, we've sent a password reset link." 
      })
    }

    // Reset token oluştur
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 saat

    // Token'ı veritabanına kaydet
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()

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

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'FastReado - Şifre Sıfırlama',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/fastreado-logo.png" alt="FastReado" style="height: 60px;">
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Şifre Sıfırlama Talebi</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Merhaba,<br><br>
              FastReado hesabınız için şifre sıfırlama talebinde bulundunuz. 
              Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Şifremi Sıfırla
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Bu bağlantı 1 saat boyunca geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, 
              bu e-postayı görmezden gelebilirsiniz.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      message: "Password reset email sent successfully" 
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}