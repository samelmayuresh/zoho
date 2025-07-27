-- Row Level Security Policies for Zoho CRM

-- Helper function to get current user's profile
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM user_profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles up
    JOIN roles r ON up.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE up.id = auth.uid() 
    AND p.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles up
    JOIN roles r ON up.role_id = r.id
    WHERE up.id = auth.uid() 
    AND r.name IN ('Super Admin', 'Admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check territory access
CREATE OR REPLACE FUNCTION has_territory_access(record_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_territory UUID;
  record_territory UUID;
BEGIN
  -- Admins have access to all territories
  IF is_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Get current user's territory
  SELECT territory_id INTO current_territory 
  FROM user_profiles 
  WHERE id = auth.uid();
  
  -- Get record owner's territory
  SELECT territory_id INTO record_territory 
  FROM user_profiles 
  WHERE id = record_user_id;
  
  -- Allow access if same territory or no territory restrictions
  RETURN current_territory IS NULL OR record_territory IS NULL OR current_territory = record_territory;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all profiles" ON user_profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view profiles in same territory" ON user_profiles
  FOR SELECT USING (has_territory_access(id));

-- Accounts Policies
CREATE POLICY "Users can view accounts they created or are assigned to" ON accounts
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin() OR
    has_territory_access(assigned_to)
  );

CREATE POLICY "Users can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (assigned_to = auth.uid() OR has_territory_access(assigned_to))
  );

CREATE POLICY "Users can update accounts they own or are assigned to" ON accounts
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Admins can delete accounts" ON accounts
  FOR DELETE USING (is_admin());

-- Contacts Policies
CREATE POLICY "Users can view contacts they created or are assigned to" ON contacts
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin() OR
    has_territory_access(assigned_to) OR
    -- Can view contacts of accounts they have access to
    account_id IN (
      SELECT id FROM accounts 
      WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can create contacts" ON contacts
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (assigned_to = auth.uid() OR has_territory_access(assigned_to))
  );

CREATE POLICY "Users can update contacts they own or are assigned to" ON contacts
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE USING (is_admin());

-- Leads Policies
CREATE POLICY "Users can view leads they created or are assigned to" ON leads
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin() OR
    has_territory_access(assigned_to)
  );

CREATE POLICY "Users can create leads" ON leads
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (assigned_to = auth.uid() OR has_territory_access(assigned_to))
  );

CREATE POLICY "Users can update leads they own or are assigned to" ON leads
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Admins can delete leads" ON leads
  FOR DELETE USING (is_admin());

-- Deals Policies
CREATE POLICY "Users can view deals they created or are assigned to" ON deals
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin() OR
    has_territory_access(assigned_to) OR
    -- Can view deals of accounts they have access to
    account_id IN (
      SELECT id FROM accounts 
      WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "Users can create deals" ON deals
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (assigned_to = auth.uid() OR has_territory_access(assigned_to))
  );

CREATE POLICY "Users can update deals they own or are assigned to" ON deals
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Admins can delete deals" ON deals
  FOR DELETE USING (is_admin());

-- Projects Policies
CREATE POLICY "Users can view projects they created or are assigned to" ON projects
  FOR SELECT USING (
    created_by = auth.uid() OR 
    project_manager_id = auth.uid() OR 
    is_admin() OR
    has_territory_access(project_manager_id) OR
    -- Can view projects they are team members of
    id IN (
      SELECT project_id FROM project_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (project_manager_id = auth.uid() OR has_territory_access(project_manager_id))
  );

CREATE POLICY "Project managers can update their projects" ON projects
  FOR UPDATE USING (
    project_manager_id = auth.uid() OR 
    created_by = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Admins can delete projects" ON projects
  FOR DELETE USING (is_admin());

-- Tasks Policies
CREATE POLICY "Users can view tasks in projects they have access to" ON tasks
  FOR SELECT USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR 
    is_admin() OR
    project_id IN (
      SELECT id FROM projects 
      WHERE created_by = auth.uid() 
      OR project_manager_id = auth.uid()
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create tasks in accessible projects" ON tasks
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    project_id IN (
      SELECT id FROM projects 
      WHERE created_by = auth.uid() 
      OR project_manager_id = auth.uid()
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update tasks they own or are assigned to" ON tasks
  FOR UPDATE USING (
    assigned_to = auth.uid() OR 
    created_by = auth.uid() OR 
    is_admin() OR
    project_id IN (
      SELECT id FROM projects 
      WHERE project_manager_id = auth.uid()
    )
  );

CREATE POLICY "Project managers and admins can delete tasks" ON tasks
  FOR DELETE USING (
    is_admin() OR
    project_id IN (
      SELECT id FROM projects 
      WHERE project_manager_id = auth.uid()
    )
  );

-- Time Entries Policies
CREATE POLICY "Users can view their own time entries" ON time_entries
  FOR SELECT USING (
    user_id = auth.uid() OR 
    is_admin() OR
    project_id IN (
      SELECT id FROM projects 
      WHERE project_manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own time entries" ON time_entries
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    project_id IN (
      SELECT id FROM projects 
      WHERE created_by = auth.uid() 
      OR project_manager_id = auth.uid()
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own time entries" ON time_entries
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    is_admin() OR
    (project_id IN (
      SELECT id FROM projects 
      WHERE project_manager_id = auth.uid()
    ) AND NOT approved)
  );

CREATE POLICY "Project managers and admins can delete time entries" ON time_entries
  FOR DELETE USING (
    user_id = auth.uid() OR
    is_admin() OR
    project_id IN (
      SELECT id FROM projects 
      WHERE project_manager_id = auth.uid()
    )
  );

-- Activities Policies
CREATE POLICY "Users can view activities they created or are assigned to" ON activities
  FOR SELECT USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin() OR
    has_territory_access(assigned_to)
  );

CREATE POLICY "Users can create activities" ON activities
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    (assigned_to = auth.uid() OR has_territory_access(assigned_to))
  );

CREATE POLICY "Users can update activities they own or are assigned to" ON activities
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Users can delete activities they created" ON activities
  FOR DELETE USING (
    created_by = auth.uid() OR 
    is_admin()
  );

-- Attachments Policies
CREATE POLICY "Users can view attachments of records they have access to" ON attachments
  FOR SELECT USING (
    uploaded_by = auth.uid() OR 
    is_admin() OR
    -- Check access based on related record type
    (related_to_type = 'lead' AND related_to_id IN (
      SELECT id FROM leads WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'contact' AND related_to_id IN (
      SELECT id FROM contacts WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'account' AND related_to_id IN (
      SELECT id FROM accounts WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'deal' AND related_to_id IN (
      SELECT id FROM deals WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'project' AND related_to_id IN (
      SELECT id FROM projects WHERE created_by = auth.uid() OR project_manager_id = auth.uid()
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    ))
  );

CREATE POLICY "Users can upload attachments to accessible records" ON attachments
  FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can delete attachments they uploaded" ON attachments
  FOR DELETE USING (
    uploaded_by = auth.uid() OR 
    is_admin()
  );

-- Comments Policies
CREATE POLICY "Users can view comments on records they have access to" ON comments
  FOR SELECT USING (
    created_by = auth.uid() OR 
    is_admin() OR
    -- Check access based on related record type (similar to attachments)
    (related_to_type = 'lead' AND related_to_id IN (
      SELECT id FROM leads WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'contact' AND related_to_id IN (
      SELECT id FROM contacts WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'account' AND related_to_id IN (
      SELECT id FROM accounts WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'deal' AND related_to_id IN (
      SELECT id FROM deals WHERE created_by = auth.uid() OR assigned_to = auth.uid()
    )) OR
    (related_to_type = 'project' AND related_to_id IN (
      SELECT id FROM projects WHERE created_by = auth.uid() OR project_manager_id = auth.uid()
      OR id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    ))
  );

CREATE POLICY "Users can create comments on accessible records" ON comments
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (
    created_by = auth.uid() OR 
    is_admin()
  );

-- Public read access for reference tables
CREATE POLICY "Anyone can read roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Anyone can read permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Anyone can read deal stages" ON deal_stages FOR SELECT USING (true);
CREATE POLICY "Anyone can read territories" ON territories FOR SELECT USING (true);

-- Email templates and campaigns (admin only for now)
CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view active email templates" ON email_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view email campaigns they created" ON email_campaigns
  FOR SELECT USING (created_by = auth.uid() OR is_admin());

-- Workflow rules (admin only)
CREATE POLICY "Admins can manage workflow rules" ON workflow_rules
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view active workflow rules" ON workflow_rules
  FOR SELECT USING (is_active = true);

-- Audit log (read-only for users, full access for admins)
CREATE POLICY "Users can view audit log for their actions" ON audit_log
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "System can insert audit log entries" ON audit_log
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions to service role for admin operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;