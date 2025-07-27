import { Lead, LeadScoringCriteria, DEFAULT_SCORING_CRITERIA, LeadRating } from '@/types/lead'

export function calculateLeadScore(lead: Partial<Lead>, criteria: LeadScoringCriteria = DEFAULT_SCORING_CRITERIA): number {
  let score = 0

  // Basic field scoring
  if (lead.email) score += criteria.hasEmail
  if (lead.phone) score += criteria.hasPhone
  if (lead.company) score += criteria.hasCompany
  if (lead.jobTitle) score += criteria.hasJobTitle

  // Source-based scoring
  if (lead.source) {
    score += criteria.sourceWeights[lead.source] || 0
  }

  return Math.max(0, Math.min(100, score)) // Keep score between 0-100
}

export function getLeadRatingFromScore(score: number): LeadRating {
  if (score >= 70) return LeadRating.HOT
  if (score >= 40) return LeadRating.WARM
  return LeadRating.COLD
}

export function updateLeadScoreAndRating(lead: Partial<Lead>): { score: number; rating: LeadRating } {
  const score = calculateLeadScore(lead)
  const rating = getLeadRatingFromScore(score)
  return { score, rating }
}