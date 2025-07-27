import { supabaseAdmin } from './supabase'

// Database setup functions
export async function createBasicTables() {
  try {
    console.log('Creating basic CRM tables...')

    // Create roles table
    const { error: rolesError } = await supabaseAdmin
      .from('roles')
      .upsert([
        { name: 'Super Admin', description: 'Full system access', hierarchy: 100 },
        { name: 'Admin', description: 'Administrative access', hierarchy: 90 },
        { name: 'Sales Manager', description: 'Sales team management', hierarchy: 80 },
        { name: 'Project Manager', description: 'Project management access', hierarchy: 70 },
        { name: 'Sales Rep', description: 'Sales representative access', hierarchy: 60 },
        { name: 'User', description: 'Basic user access', hierarchy: 50 }
      ])

    if (rolesError) {
      console.error('Error creating roles:', rolesError)
    } else {
      console.log('✅ Roles created successfully')
    }

    return { success: true }
  } catch (error) {
    console.error('Database setup error:', error)
    return { success: false, error }
  }
}

// User profile functions
export async function createUserProfile(userId: string, profileData: {
  firstName: string
  lastName: string
  email: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: userId,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        is_active: true,
        custom_fields: {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('User profile creation error:', error)
    return { success: false, error }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('User profile fetch error:', error)
    return { success: false, error }
  }
}

// Lead functions
export async function createLead(leadData: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  source?: string
  assignedTo: string
  createdBy: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        source: leadData.source || 'other',
        status: 'new',
        rating: 'cold',
        assigned_to: leadData.assignedTo,
        created_by: leadData.createdBy,
        custom_fields: {},
        tags: []
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Lead creation error:', error)
    return { success: false, error }
  }
}

export async function getLeads(userId: string, filters?: {
  status?: string
  assignedTo?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabaseAdmin
      .from('leads')
      .select(`
        *,
        assigned_user:user_profiles!assigned_to(*),
        created_user:user_profiles!created_by(*)
      `)

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo)
    }

    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Leads fetch error:', error)
    return { success: false, error }
  }
}

// Contact functions
export async function createContact(contactData: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  accountId?: string
  jobTitle?: string
  assignedTo: string
  createdBy: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert({
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        account_id: contactData.accountId,
        job_title: contactData.jobTitle,
        assigned_to: contactData.assignedTo,
        created_by: contactData.createdBy,
        custom_fields: {},
        tags: []
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Contact creation error:', error)
    return { success: false, error }
  }
}

// Deal functions
export async function createDeal(dealData: {
  name: string
  accountId?: string
  contactId?: string
  amount?: number
  expectedCloseDate?: string
  assignedTo: string
  createdBy: string
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('deals')
      .insert({
        name: dealData.name,
        account_id: dealData.accountId,
        contact_id: dealData.contactId,
        amount: dealData.amount,
        currency: 'USD',
        probability: 10,
        expected_close_date: dealData.expectedCloseDate,
        type: 'new_business',
        assigned_to: dealData.assignedTo,
        created_by: dealData.createdBy,
        custom_fields: {},
        tags: []
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating deal:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Deal creation error:', error)
    return { success: false, error }
  }
}