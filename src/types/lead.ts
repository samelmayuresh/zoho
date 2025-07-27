// Lead Management Types

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  source: LeadSource
  status: LeadStatus
  rating: LeadRating
  score: number
  description?: string
  customFields?: Record<string, any>
  tags: string[]
  assignedToId?: string
  assignedTo?: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  createdById: string
  createdBy: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  convertedAt?: Date
  convertedContactId?: string
  convertedAccountId?: string
  convertedDealId?: string
  lastContactedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  COLD_CALL = 'COLD_CALL',
  TRADE_SHOW = 'TRADE_SHOW',
  PARTNER = 'PARTNER',
  OTHER = 'OTHER'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  CONVERTED = 'CONVERTED'
}

export enum LeadRating {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD'
}

export interface CreateLeadData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  source: LeadSource
  description?: string
  customFields?: Record<string, any>
  tags?: string[]
  assignedToId?: string
}

export interface UpdateLeadData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  source?: LeadSource
  status?: LeadStatus
  rating?: LeadRating
  description?: string
  customFields?: Record<string, any>
  tags?: string[]
  assignedToId?: string
}

export interface LeadFilters {
  status?: LeadStatus[]
  source?: LeadSource[]
  rating?: LeadRating[]
  assigneeId?: string
  search?: string
  scoreMin?: number
  scoreMax?: number
  createdAfter?: Date
  createdBefore?: Date
}

export interface LeadListResponse {
  leads: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LeadActivity {
  id: string
  type: ActivityType
  subject: string
  description?: string
  date: Date
  status: ActivityStatus
  createdBy: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  createdAt: Date
}

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  TASK = 'TASK',
  NOTE = 'NOTE'
}

export enum ActivityStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CreateActivityData {
  type: ActivityType
  subject: string
  description?: string
  date: Date
  status?: ActivityStatus
}

// Simple scoring system
export interface LeadScoringCriteria {
  hasEmail: number
  hasPhone: number
  hasCompany: number
  hasJobTitle: number
  sourceWeights: Record<LeadSource, number>
}

export const DEFAULT_SCORING_CRITERIA: LeadScoringCriteria = {
  hasEmail: 10,
  hasPhone: 5,
  hasCompany: 15,
  hasJobTitle: 10,
  sourceWeights: {
    [LeadSource.WEBSITE]: 20,
    [LeadSource.REFERRAL]: 25,
    [LeadSource.SOCIAL_MEDIA]: 10,
    [LeadSource.EMAIL_CAMPAIGN]: 15,
    [LeadSource.COLD_CALL]: 5,
    [LeadSource.TRADE_SHOW]: 20,
    [LeadSource.PARTNER]: 25,
    [LeadSource.OTHER]: 5
  }
}