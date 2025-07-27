# Zoho CRM Setup Guide

## Quick Start

### 1. Database Setup
Since Supabase doesn't support direct SQL execution via API, you need to set up the database manually:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `grhrzxgxazzvnouxczbb`
3. Go to **SQL Editor**
4. Copy and paste the contents of `database/schema.sql`
5. Click **Run** to create all tables
6. Copy and paste the contents of `database/rls-policies.sql`
7. Click **Run** to set up security policies

### 2. Test the Setup
```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` and:
1. Click "Initialize Database" to add default roles
2. Click "Test RLS Policies" to verify security
3. Click "Manage Users" to test user management

### 3. Available Scripts
```bash
npm run dev          # Start development server
npm run db:push      # Push database schema (requires manual setup first)
npm run build        # Build for production
```

## Features Implemented

### ✅ Authentication System
- Mock authentication for development
- User session management
- Protected routes

### ✅ Database Schema
- Complete CRM tables (users, leads, contacts, accounts, deals)
- Project management tables (projects, tasks, time entries)
- Row Level Security policies
- Audit logging system

### ✅ User Management
- User CRUD operations
- Role-based permissions
- User profile management
- Active/inactive status

## Next Steps

1. **Lead Management** - Create lead capture and conversion system
2. **Contact Management** - Build contact relationship management
3. **Deal Pipeline** - Implement sales pipeline with drag-and-drop
4. **Project Management** - Add project and task management features
5. **Email Integration** - Connect with Resend for email campaigns
6. **SMS Integration** - Connect with Twilio for SMS notifications

## API Endpoints

### Users
- `GET /api/users` - List users with pagination and filters
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Deactivate user

### Roles
- `GET /api/roles` - List all roles
- `POST /api/roles` - Create new role

### Database
- `POST /api/init-database` - Initialize database with default data
- `POST /api/setup-tables` - Setup basic tables

## Environment Variables

Make sure these are set in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://grhrzxgxazzvnouxczbb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## Troubleshooting

### Database Issues
- If tables don't exist, manually run the SQL in Supabase dashboard
- Check Supabase logs for any errors
- Verify environment variables are correct

### Authentication Issues
- Currently using mock authentication for development
- Real Stytch integration can be added later
- Check browser localStorage for user session

### API Issues
- Check browser console for errors
- Verify API routes are accessible
- Check Supabase permissions and RLS policies