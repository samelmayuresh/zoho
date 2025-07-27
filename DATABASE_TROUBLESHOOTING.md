# Database Connection Troubleshooting

## 🔍 Current Issue
```
Can't reach database server at `aws-0-ap-south-1.pooler.supabase.com:6543`
```

## 🛠️ Solutions (Try in order)

### 1. **Switch to Direct Connection** ✅ (Already Applied)
```env
# Use direct connection instead of pooler
DATABASE_URL="postgresql://postgres.grhrzxgxazzvnouxczbb:Mayuresh@2007@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

### 2. **Test Database Connection**
```bash
node test-db-connection.js
```

### 3. **Check Supabase Project Status**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Verify your project is active and not paused
- Check if there are any maintenance notifications

### 4. **Verify Network Connection**
```bash
# Test if you can reach the server
ping aws-0-ap-south-1.pooler.supabase.com
```

### 5. **Restart Development Server**
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### 6. **Clear Prisma Cache**
```bash
npx prisma generate --force
rm -rf node_modules/.prisma
npm install
```

### 7. **Alternative: Use Connection Pooling**
If direct connection works but you need pooling:
```env
DATABASE_URL="postgresql://postgres.grhrzxgxazzvnouxczbb:Mayuresh@2007@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

## 🧪 Quick Tests

### Test 1: Basic Connection
```bash
npx prisma db push
```

### Test 2: Query Test
```bash
npm run db:seed
```

### Test 3: API Test
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_demo","password":"admin123!"}'
```

## 🔧 Environment Variables Check

Make sure your `.env` has:
```env
DATABASE_URL="postgresql://postgres.grhrzxgxazzvnouxczbb:Mayuresh@2007@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.grhrzxgxazzvnouxczbb:Mayuresh@2007@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

## 🚨 Emergency Fallback

If Supabase is completely down, you can:

1. **Use Local PostgreSQL**
   ```bash
   # Install PostgreSQL locally
   # Update DATABASE_URL to local instance
   DATABASE_URL="postgresql://username:password@localhost:5432/zoho_crm"
   ```

2. **Use SQLite for Testing**
   ```prisma
   // In schema.prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

## 📊 Connection Status Indicators

- ✅ **Working**: User creation succeeds, login works
- ⚠️ **Intermittent**: Some requests fail, others work
- ❌ **Down**: All database operations fail

## 🔄 Current Status

After applying the direct connection fix:
- Database URL updated to use port 5432 (direct)
- Removed pgbouncer parameter
- Should resolve connection timeout issues

Try creating a user again after restarting the dev server!