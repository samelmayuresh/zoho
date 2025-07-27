// User Management Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  profile: UserProfile
  permissions: Permission[]
  territory?: Territory
  isActive: boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserRole {
  id: string
  name: string
  permissions: Permission[]
  hierarchy: number
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  roleId: string
  territoryId?: string
  isActive: boolean
  customFields: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

export interface Territory {
  id: string
  name: string
  criteria: TerritoryRule[]
  assignedUsers: string[]
}

export interface TerritoryRule {
  field: string
  operator: string
  value: string
}

// Lead Management Types
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  source: LeadSource
  status: LeadStatus
  rating: LeadRating
  assignedTo: string
  customFields: Record<string, any>
  activities: Activity[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  convertedAt?: Date
  convertedContactId?: string
  convertedDealId?: string
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  UNQUALIFIED = 'unqualified',
  CONVERTED = 'converted'
}

export enum LeadRating {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold'
}

export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  PHONE_CALL = 'phone_call',
  TRADE_SHOW = 'trade_show',
  OTHER = 'other'
}

// Contact Management Types
export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  mobilePhone: string
  accountId: string
  jobTitle: string
  department: string
  address: Address
  socialProfiles: SocialProfile[]
  customFields: Record<string, any>
  activities: Activity[]
  deals: string[]
  isPrimary: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SocialProfile {
  platform: 'linkedin' | 'twitter' | 'facebook'
  url: string
  username: string
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Account Management Types
export interface Account {
  id: string
  name: string
  website: string
  industry: string
  type: AccountType
  size: CompanySize
  revenue: number
  parentAccountId?: string
  billingAddress: Address
  shippingAddress: Address
  contacts: string[]
  deals: string[]
  customFields: Record<string, any>
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export enum AccountType {
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
  PARTNER = 'partner',
  COMPETITOR = 'competitor'
}

export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

// Deal Management Types
export interface Deal {
  id: string
  name: string
  accountId: string
  contactId: string
  amount: number
  currency: string
  stage: DealStage
  probability: number
  expectedCloseDate: Date
  actualCloseDate?: Date
  source: string
  type: DealType
  assignedTo: string
  competitors: string[]
  customFields: Record<string, any>
  activities: Activity[]
  attachments: Attachment[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface DealStage {
  id: string
  name: string
  probability: number
  order: number
  isWon: boolean
  isLost: boolean
}

export enum DealType {
  NEW_BUSINESS = 'new_business',
  EXISTING_BUSINESS = 'existing_business',
  RENEWAL = 'renewal',
  UPSELL = 'upsell'
}

// Activity Types
export interface Activity {
  id: string
  type: ActivityType
  subject: string
  description: string
  date: Date
  duration?: number
  status: ActivityStatus
  priority: Priority
  assignedTo: string
  relatedTo: {
    type: 'lead' | 'contact' | 'account' | 'deal'
    id: string
  }
  createdAt: Date
  updatedAt: Date
}

export enum ActivityType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
  NOTE = 'note'
}

export enum ActivityStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Attachment Types
export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Filter and Search Types
export interface BaseFilters {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface LeadFilters extends BaseFilters {
  status?: LeadStatus
  source?: LeadSource
  rating?: LeadRating
  assignedTo?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface ContactFilters extends BaseFilters {
  accountId?: string
  isPrimary?: boolean
}

export interface DealFilters extends BaseFilters {
  stageId?: string
  assignedTo?: string
  amountRange?: {
    min: number
    max: number
  }
  closeDateRange?: {
    start: Date
    end: Date
  }
}