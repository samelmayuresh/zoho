import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up basic tables using direct table operations...')

    // First, try to create roles table by inserting data (this will create the table if it doesn't exist)
    const { data: existingRoles, error: checkRolesError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .limit(1)

    let rolesCreated = false
    if (checkRolesError && checkRolesError.code === 'PGRST116') {
      // Table doesn't exist, we need to create it manually in Supabase dashboard
      console.log('Roles table does not exist. Please create it manually in Supabase dashboard.')
    } else {
      // Table exists, insert default roles
      const { error: insertRolesError } = await supabaseAdmin
        .from('roles')
        .upsert([
          { name: 'Super Admin', description: 'Full system access', hierarchy: 100 },
          { name: 'Admin', description: 'Administrative access', hierarchy: 90 },
          { name: 'Sales Manager', description: 'Sales team management', hierarchy: 80 },
          { name: 'Project Manager', description: 'Project management access', hierarchy: 70 },
          { name: 'Sales Rep', description: 'Sales representative access', hierarchy: 60 },
          { name: 'User', description: 'Basic user access', hierarchy: 50 }
        ], { onConflict: 'name' })

      if (!insertRolesError) {
        rolesCreated = true
        console.log('✅ Default roles inserted successfully')
      } else {
        console.error('Insert roles error:', insertRolesError)
      }
    }

    // Check user_profiles table
    const { data: existingProfiles, error: checkProfilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .limit(1)

    let profilesReady = false
    if (checkProfilesError && checkProfilesError.code === 'PGRST116') {
      console.log('User profiles table does not exist. Please create it manually in Supabase dashboard.')
    } else {
      profilesReady = true
      console.log('✅ User profiles table is ready')
    }

    // Check deal_stages table
    const { data: existingStages, error: checkStagesError } = await supabaseAdmin
      .from('deal_stages')
      .select('id')
      .limit(1)

    let stagesCreated = false
    if (checkStagesError && checkStagesError.code === 'PGRST116') {
      console.log('Deal stages table does not exist. Please create it manually in Supabase dashboard.')
    } else {
      // Insert default deal stages
      const { error: insertStagesError } = await supabaseAdmin
        .from('deal_stages')
        .upsert([
          { name: 'Prospecting', probability: 10, stage_order: 1, is_won: false, is_lost: false },
          { name: 'Qualification', probability: 25, stage_order: 2, is_won: false, is_lost: false },
          { name: 'Proposal', probability: 50, stage_order: 3, is_won: false, is_lost: false },
          { name: 'Negotiation', probability: 75, stage_order: 4, is_won: false, is_lost: false },
          { name: 'Closed Won', probability: 100, stage_order: 5, is_won: true, is_lost: false },
          { name: 'Closed Lost', probability: 0, stage_order: 6, is_won: false, is_lost: true }
        ], { onConflict: 'name' })

      if (!insertStagesError) {
        stagesCreated = true
        console.log('✅ Default deal stages inserted successfully')
      } else {
        console.error('Insert stages error:', insertStagesError)
      }
    }

    return NextResponse.json({
      message: 'Table setup process completed',
      success: true,
      status: {
        rolesCreated,
        profilesReady,
        stagesCreated,
        needsManualSetup: !rolesCreated || !profilesReady || !stagesCreated
      },
      instructions: !rolesCreated || !profilesReady || !stagesCreated ? 
        'Some tables need to be created manually in Supabase dashboard. Please run the SQL from database/schema.sql' : 
        'All tables are ready!'
    })
  } catch (error) {
    console.error('Setup tables error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error },
      { status: 500 }
    )
  }
}