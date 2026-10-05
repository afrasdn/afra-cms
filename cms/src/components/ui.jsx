// Shared reusable UI primitives for CMS

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.625rem',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function Btn({ children, onClick, variant = 'primary', type = 'button', disabled = false, style = {}, size = 'md' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    border: 'none', borderRadius: '0.375rem', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontWeight: 700, transition: 'all 0.15s',
    opacity: disabled ? 0.6 : 1,
    fontSize: size === 'sm' ? '0.78rem' : '0.84rem',
    padding: size === 'sm' ? '0.45rem 0.85rem' : '0.65rem 1.25rem',
  }
  const variants = {
    primary: { background: '#0369a1', color: '#ffffff', border: '1px solid #0369a1' },
    secondary: { background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' },
    danger: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
    ghost: { background: 'transparent', color: '#64748b', border: '1px solid transparent' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:  { bg: '#e0f2fe', text: '#0369a1' },
    green: { bg: '#f0fdf4', text: '#16a34a' },
    red:   { bg: '#fef2f2', text: '#dc2626' },
    gray:  { bg: '#f1f5f9', text: '#475569' },
    amber: { bg: '#fffbeb', text: '#b45309' },
  }
  const c = colors[color] ?? colors.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.2rem 0.65rem', borderRadius: '0.25rem',
      fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em',
      background: c.bg, color: c.text,
    }}>
      {children}
    </span>
  )
}

export function Input({ label, id, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && <label htmlFor={id} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{label}</label>}
      <input
        id={id}
        {...props}
        style={{
          width: '100%', padding: '0.7rem 1rem',
          border: `1px solid ${error ? '#fca5a5' : '#e2e8f0'}`,
          borderRadius: '0.375rem', background: '#f8fafc',
          color: '#0f172a', fontFamily: 'inherit', fontSize: '0.9rem',
          outline: 'none', transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.background = '#fff' }}
        onBlur={e => { e.target.style.borderColor = error ? '#fca5a5' : '#e2e8f0'; e.target.style.background = '#f8fafc' }}
      />
      {error && <span style={{ fontSize: '0.76rem', color: '#dc2626' }}>{error}</span>}
    </div>
  )
}

export function Textarea({ label, id, error, rows = 4, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && <label htmlFor={id} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{label}</label>}
      <textarea
        id={id}
        rows={rows}
        {...props}
        style={{
          width: '100%', padding: '0.7rem 1rem',
          border: `1px solid ${error ? '#fca5a5' : '#e2e8f0'}`,
          borderRadius: '0.375rem', background: '#f8fafc',
          color: '#0f172a', fontFamily: 'inherit', fontSize: '0.9rem',
          outline: 'none', resize: 'vertical', transition: 'border-color 0.15s',
        }}
        onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.background = '#fff' }}
        onBlur={e => { e.target.style.borderColor = error ? '#fca5a5' : '#e2e8f0'; e.target.style.background = '#f8fafc' }}
      />
      {error && <span style={{ fontSize: '0.76rem', color: '#dc2626' }}>{error}</span>}
    </div>
  )
}

export function Select({ label, id, error, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && <label htmlFor={id} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{label}</label>}
      <select
        id={id}
        {...props}
        style={{
          width: '100%', padding: '0.7rem 1rem',
          border: `1px solid ${error ? '#fca5a5' : '#e2e8f0'}`,
          borderRadius: '0.375rem', background: '#f8fafc',
          color: '#0f172a', fontFamily: 'inherit', fontSize: '0.9rem',
          outline: 'none', transition: 'border-color 0.15s', cursor: 'pointer',
        }}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: '0.76rem', color: '#dc2626' }}>{error}</span>}
    </div>
  )
}

export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `${size > 20 ? 3 : 2}px solid #e2e8f0`,
      borderTopColor: '#0369a1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block',
    }} />
  )
}

// English companion inputs for bilingual CMS forms.
// Guna sebelah BM input: <Input label="Tajuk" .../> + <ENInput label="Tajuk" .../>
export function ENInput({ label, ...props }) {
  return <Input label={label ? `${label} (EN)` : 'English version'} {...props} />
}

export function ENTextarea({ label, ...props }) {
  return <Textarea label={label ? `${label} (EN)` : 'English version'} {...props} />
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      {Icon && (
        <div style={{
          width: '4rem', height: '4rem', borderRadius: '1rem',
          background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <Icon size={24} color="#94a3b8" />
        </div>
      )}
      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.86rem', color: '#64748b', maxWidth: '26rem', margin: '0 auto' }}>{description}</p>}
      {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
    </div>
  )
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '0.75rem', padding: '2rem',
        maxWidth: '24rem', width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Btn variant="secondary" onClick={onCancel} disabled={loading}>Batal</Btn>
          <Btn variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner size={14} /> : null} Padam
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: '2.25rem', height: '1.25rem', borderRadius: '9999px',
          background: checked ? '#0369a1' : '#cbd5e1',
          position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: '0.15rem',
          left: checked ? 'calc(100% - 1rem - 0.15rem)' : '0.15rem',
          width: '0.95rem', height: '0.95rem',
          borderRadius: '50%', background: '#ffffff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </div>
      {label && <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>{label}</span>}
    </label>
  )
}
