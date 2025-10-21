import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com'

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn('SMTP config incomplete. Email sending will fail until SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS are set.')
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
})

export async function sendVerificationEmail(to: string, code: string) {
  if (!transporter) throw new Error('No mail transporter')

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Doğrulama - Fastreado</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .logo-icon {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .verification-code {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          display: inline-block;
        }
        .code-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          color: #1e293b;
          letter-spacing: 4px;
          font-family: 'Courier New', monospace;
        }
        .instructions {
          font-size: 16px;
          color: #475569;
          margin: 25px 0;
          line-height: 1.7;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px 20px;
          margin: 25px 0;
          border-radius: 6px;
        }
        .warning p {
          color: #92400e;
          font-size: 14px;
          margin: 0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .header, .content, .footer {
            padding: 30px 20px;
          }
          .code {
            font-size: 28px;
            letter-spacing: 2px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <div class="logo-icon">⚡</div>
            Fastreado
          </div>
          <h1>Email Doğrulama</h1>
          <p>Hesabınızı doğrulamak için aşağıdaki kodu kullanın</p>
        </div>
        
        <div class="content">
          <div class="verification-code">
            <div class="code-label">Doğrulama Kodu</div>
            <div class="code">${code}</div>
          </div>
          
          <div class="instructions">
            Bu kodu Fastreado uygulamasındaki doğrulama sayfasına girin. 
            Kod <strong>1 saat</strong> boyunca geçerlidir.
          </div>
          
          <div class="warning">
            <p>
              <strong>Güvenlik Uyarısı:</strong> Bu kodu kimseyle paylaşmayın. 
              Fastreado ekibi asla bu kodu sizden istemez.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>Bu email otomatik olarak gönderilmiştir.</p>
          <p>
            Eğer bu hesabı oluşturmadıysanız, bu emaili görmezden gelebilirsiniz.
          </p>
          <p>
            <a href="mailto:support@fastreado.com">Destek</a> | 
            <a href="https://fastreado.com">Fastreado.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const textVersion = `
Fastreado - Email Doğrulama

Merhaba,

Hesabınızı doğrulamak için aşağıdaki 6 haneli kodu kullanın:

${code}

Bu kodu Fastreado uygulamasındaki doğrulama sayfasına girin.
Kod 1 saat boyunca geçerlidir.

Güvenlik Uyarısı: Bu kodu kimseyle paylaşmayın.

Eğer bu hesabı oluşturmadıysanız, bu emaili görmezden gelebilirsiniz.

Fastreado Ekibi
  `

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: '🔐 Fastreado - Email Doğrulama Kodu',
    text: textVersion,
    html: htmlTemplate,
  })

  return info
}

export default transporter
