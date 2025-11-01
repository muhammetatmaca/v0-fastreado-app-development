import mongoose from 'mongoose'

interface PDFMetadata {
  id: string
  title: string
  driveFileId?: string
  coverUrl?: string
  pageCount: number
  uploadDate: string
  progress: number
  isUserUploaded: boolean
  isPublicBook?: boolean
  userId?: string
  fileName?: string
  fileSize?: number
  webViewLink?: string
  webContentLink?: string
}

interface Purchase {
  provider: string
  productId: string
  purchaseToken?: string
  orderId?: string
  purchaseTime: Date
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
}

interface IUser {
  name: string
  email: string
  password?: string
  googleId?: string
  avatar?: string
  plan: 'free' | 'premium'
  isVerified: boolean
  verificationCode?: string
  verificationExpires?: Date
  pdfs?: PDFMetadata[]
  purchases?: Purchase[]
  // Google Drive fields
  driveFolderId?: string
  // Premium subscription fields
  isPremium: boolean
  premiumPlan?: string
  premiumStartDate?: Date
  premiumEndDate?: Date
  paymentProvider?: string
  paymentId?: string
  // Password reset fields
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  googleId: {
    type: String,
    sparse: true, // Allow null values but ensure uniqueness when present
    index: true
  },
  avatar: {
    type: String,
    default: null
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  // Premium subscription fields
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumPlan: {
    type: String,
    default: null
  },
  premiumStartDate: {
    type: Date,
    default: null
  },
  premiumEndDate: {
    type: Date,
    default: null
  },
  paymentProvider: {
    type: String,
    default: null
  },
  paymentId: {
    type: String,
    default: null
  },
  // Password reset fields
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    select: false
  },
  verificationExpires: {
    type: Date,
    select: false
  },
  // Google Drive fields
  driveFolderId: {
    type: String,
    default: null
  },
  pdfs: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    driveFileId: { type: String },
    coverUrl: { type: String },
    pageCount: { type: Number, required: true },
    uploadDate: { type: String, required: true },
    progress: { type: Number, default: 0 },
    isUserUploaded: { type: Boolean, default: true },
    isPublicBook: { type: Boolean, default: false },
    userId: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    webViewLink: { type: String },
    webContentLink: { type: String }
  }],
  purchases: [{
    provider: { type: String, required: true },
    productId: { type: String, required: true },
    purchaseToken: { type: String },
    orderId: { type: String },
    purchaseTime: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
})

// Indexes
userSchema.index({ verificationCode: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export type { IUser, PDFMetadata, Purchase }