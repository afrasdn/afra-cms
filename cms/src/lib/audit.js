import { supabase } from '../lib/supabase'

/**
 * Insert an audit log entry.
 * Called after every CRUD operation.
 */
export async function logAudit({ userId, userEmail, action, tableName, recordId, oldData, newData }) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      user_email: userEmail,
      action,
      table_name: tableName,
      record_id: recordId,
      old_data: oldData ?? null,
      new_data: newData ?? null,
    })
  } catch (err) {
    // Non-fatal: log to console but don't break main flow
    console.error('Audit log failed:', err)
  }
}
