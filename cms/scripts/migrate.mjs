import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, '../../supabase/migrations/001_initial_schema.sql'), 'utf8')

const client = new pg.Client({
  connectionString: 'postgresql://postgres:Syakirganu67@db.dttqpjeuxzdgflsxjlje.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
})

async function run() {
  await client.connect()
  console.log('✅ Connected to Supabase database')
  try {
    await client.query(sql)
    console.log('✅ Migration completed successfully')
  } catch (err) {
    if (err.message.includes('already exists') || err.message.includes('duplicate')) {
      console.log('⚠️  Some objects already exist — migration may have run before. This is OK.')
    } else {
      console.error('❌ Migration error:', err.message)
    }
  } finally {
    await client.end()
    console.log('🔒 Connection closed')
  }
}

run()
