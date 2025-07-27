import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('role_permissions')
      .select(`
        permission:permissions(*)
      `)
      .eq('role_id', params.id)

    if (error) {
      console.error('Error fetching role permissions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch role permissions' },
        { status: 500 }
      )
    }

    const permissions = data?.map(item => item.permission) || []
    return NextResponse.json({ data: permissions })
  } catch (error) {
    console.error('Role permissions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { permissionIds } = body

    if (!Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'Permission IDs must be an array' },
        { status: 400 }
      )
    }

    // First, remove all existing permissions for this role
    await supabaseAdmin
      .from('role_permissions')
      .delete()
      .eq('role_id', params.id)

    // Then add the new permissions
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role_id: params.id,
        permission_id: permissionId
      }))

      const { error } = await supabaseAdmin
        .from('role_permissions')
        .insert(rolePermissions)

      if (error) {
        console.error('Error updating role permissions:', error)
        return NextResponse.json(
          { error: 'Failed to update role permissions' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      message: 'Role permissions updated successfully' 
    })
  } catch (error) {
    console.error('Update role permissions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}