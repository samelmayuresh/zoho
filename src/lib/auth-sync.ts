import { supabaseAdmin } from './supabase'

// Sync user with Supabase when they sign up or sign in
export async function syncUserWithSupabase(stytchUser: {
  user_id: string
  email: string
  name?: {
    first_name?: string
    last_name?: string
  }
}) {
  try {
    // Check if user profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', stytchUser.user_id)
      .single()

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', stytchUser.user_id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        return { success: false, error }
      }

      return { success: true, data, isNew: false }
    } else {
      // Get default role (User role)
      const { data: defaultRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'User')
        .single()

      // Create new user profile
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: stytchUser.user_id,
          first_name: stytchUser.name?.first_name || 'User',
          last_name: stytchUser.name?.last_name || '',
          role_id: defaultRole?.id,
          is_active: true,
          custom_fields: {}
        })
        .select(`
          *,
          role:roles(*)
        `)
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return { success: false, error }
      }

      return { success: true, data, isNew: true }
    }
  } catch (error) {
    console.error('User sync error:', error)
    return { success: false, error }
  }
}

// Create a Supabase user for RLS (when using mock auth)
export async function createSupabaseUser(userData: {
  email: string
  firstName: string
  lastName: string
}) {
  try {
    // For development, we'll create a mock user ID
    const mockUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`

    // Get default role
    const { data: defaultRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'User')
      .single()

    // Create user profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: mockUserId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role_id: defaultRole?.id,
        is_active: true,
        custom_fields: {}
      })
      .select(`
        *,
        role:roles(*)
      `)
      .single()

    if (error) {
      console.error('Error creating Supabase user:', error)
      return { success: false, error }
    }

    return { success: true, data, userId: mockUserId }
  } catch (error) {
    console.error('Supabase user creation error:', error)
    return { success: false, error }
  }
}

// Initialize database with default data
export async function initializeDatabase() {
  try {
    console.log('Initializing database with default data...')

    // Check if roles exist
    const { data: existingRoles } = await supabaseAdmin
      .from('roles')
      .select('id')
      .limit(1)

    if (!existingRoles || existingRoles.length === 0) {
      // Create default roles
      const { error: rolesError } = await supabaseAdmin
        .from('roles')
        .insert([
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
        console.log('✅ Default roles created')
      }
    }

    // Check if deal stages exist
    const { data: existingStages } = await supabaseAdmin
      .from('deal_stages')
      .select('id')
      .limit(1)

    if (!existingStages || existingStages.length === 0) {
      // Create default deal stages
      const { error: stagesError } = await supabaseAdmin
        .from('deal_stages')
        .insert([
          { name: 'Prospecting', probability: 10, stage_order: 1, is_won: false, is_lost: false },
          { name: 'Qualification', probability: 25, stage_order: 2, is_won: false, is_lost: false },
          { name: 'Proposal', probability: 50, stage_order: 3, is_won: false, is_lost: false },
          { name: 'Negotiation', probability: 75, stage_order: 4, is_won: false, is_lost: false },
          { name: 'Closed Won', probability: 100, stage_order: 5, is_won: true, is_lost: false },
          { name: 'Closed Lost', probability: 0, stage_order: 6, is_won: false, is_lost: true }
        ])

      if (stagesError) {
        console.error('Error creating deal stages:', stagesError)
      } else {
        console.log('✅ Default deal stages created')
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Database initialization error:', error)
    return { success: false, error }
  }
}

// Test RLS policies
export async function testRLSPolicies(userId: string) {
  try {
    console.log('Testing RLS policies for user:', userId)

    // Test user profile access
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Profile access test failed:', profileError)
      return { success: false, error: profileError }
    }

    console.log('✅ User profile access test passed')

    // Test creating a lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        first_name: 'Test',
        last_name: 'Lead',
        email: 'test@example.com',
        company: 'Test Company',
        source: 'website',
        status: 'new',
        rating: 'warm',
        assigned_to: userId,
        created_by: userId,
        custom_fields: {},
        tags: []
      })
      .select()
      .single()

    if (leadError) {
      console.error('Lead creation test failed:', leadError)
      return { success: false, error: leadError }
    }

    console.log('✅ Lead creation test passed')

    // Test reading leads
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('assigned_to', userId)

    if (leadsError) {
      console.error('Leads read test failed:', leadsError)
      return { success: false, error: leadsError }
    }

    console.log('✅ Leads read test passed, found', leads?.length, 'leads')

    return { success: true, profile, lead, leads }
  } catch (error) {
    console.error('RLS test error:', error)
    return { success: false, error }
  }
}