import mongoose from 'mongoose'

interface PDFMetadata {
  id: string
  title: string
  pageCount: number
  uploadDate: string
  progress: number
  isUserUploaded: boolean
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
  // Premium subscription fields
  isPremium: boolean
  premiumPlan?: string
  premiumStartDate?: Date
  premiumEndDate?: Date
  paymentProvider?: string
  paymentId?: string
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
    trim: true
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  googleId: {
    type: String,
    sparse: true // Allow null values but ensure uniqueness when present
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
  pdfs: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    pageCount: { type: Number, required: true },
    uploadDate: { type: String, required: true },
    progress: { type: Number, default: 0 },
    isUserUploaded: { type: Boolean, default: true }
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
userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 })
userSchema.index({ verificationCode: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export type { IUser, PDFMetadata, Purchase }