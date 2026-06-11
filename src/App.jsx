import { useState, useEffect } from 'react'
import './App.css'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://frmusuulaqcjgovdyogi.supabase.co',
  'sb_publishable_nK7xZxm0pT3G1z8OL3iQWA_bHK194bF'
)
import {
  LayoutDashboard, Shirt, Users, Handshake,
  Plus, Search, X, Edit2, Trash2, Menu,
  TrendingUp, TrendingDown, Package, DollarSign,
  ChevronUp, ChevronDown, Save
} from 'lucide-react'

// ── LOCAL STORAGE HELPERS ──
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// ── INITIAL DEMO DATA ──
const DEMO_SHIRTS = [
  { id: 1, type: 'Polo', shirt: 500, printing: 120, carriageInward: 30, otherExpenses: 20, reserve: 50, costOfProduction: 720 },
  { id: 2, type: 'T-Shirt', shirt: 300, printing: 80, carriageInward: 20, otherExpenses: 10, reserve: 30, costOfProduction: 440 },
  { id: 3, type: 'Hoodie', shirt: 800, printing: 200, carriageInward: 50, otherExpenses: 40, reserve: 80, costOfProduction: 1170 },
  { id: 4, type: 'Sweatshirt', shirt: 650, printing: 160, carriageInward: 40, otherExpenses: 30, reserve: 60, costOfProduction: 940 },
  { id: 5, type: 'Collar Shirt', shirt: 450, printing: 100, carriageInward: 25, otherExpenses: 15, reserve: 40, costOfProduction: 630 },
  { id: 6, type: 'Fleece', shirt: 700, printing: 180, carriageInward: 45, otherExpenses: 35, reserve: 70, costOfProduction: 1030 },
  { id: 7, type: 'Tank Top', shirt: 250, printing: 60, carriageInward: 15, otherExpenses: 10, reserve: 25, costOfProduction: 360 },
  { id: 8, type: 'Full Sleeve', shirt: 420, printing: 110, carriageInward: 28, otherExpenses: 18, reserve: 42, costOfProduction: 618 },
]

const DEMO_CUSTOMERS = [
  { id: 1, date: '2024-06-01', orderNum: 'ORD-001', address: 'Karachi', phone: '0300-1234567', customer: 'Ahmed Ali', type: 'Retail', quantity: 50, paid: 8000, pending: 2000, costOfProduction: 5000, profit: 3000, discountAllowed: 500 },
  { id: 2, date: '2024-06-05', orderNum: 'ORD-002', address: 'Lahore', phone: '0301-9876543', customer: 'Sara Khan', type: 'Wholesale', quantity: 200, paid: 30000, pending: 5000, costOfProduction: 20000, profit: 10000, discountAllowed: 1000 },
  { id: 3, date: '2024-06-08', orderNum: 'ORD-003', address: 'Islamabad', phone: '0302-1122334', customer: 'Bilal Sheikh', type: 'Corporate', quantity: 500, paid: 75000, pending: 0, costOfProduction: 50000, profit: 25000, discountAllowed: 2000 },
  { id: 4, date: '2024-06-10', orderNum: 'ORD-004', address: 'Faisalabad', phone: '0303-4455667', customer: 'Hira Baig', type: 'Retail', quantity: 30, paid: 5000, pending: 1500, costOfProduction: 3500, profit: 2000, discountAllowed: 300 },
  { id: 5, date: '2024-06-12', orderNum: 'ORD-005', address: 'Multan', phone: '0304-7788990', customer: 'Zain Qureshi', type: 'Wholesale', quantity: 150, paid: 22000, pending: 3000, costOfProduction: 15000, profit: 7000, discountAllowed: 800 },
  { id: 6, date: '2024-06-15', orderNum: 'ORD-006', address: 'Karachi', phone: '0305-2233445', customer: 'Nadia Hussain', type: 'Retail', quantity: 25, paid: 4500, pending: 500, costOfProduction: 2800, profit: 1700, discountAllowed: 200 },
  { id: 7, date: '2024-06-18', orderNum: 'ORD-007', address: 'Rawalpindi', phone: '0306-6677889', customer: 'Kamran Mirza', type: 'Corporate', quantity: 300, paid: 45000, pending: 10000, costOfProduction: 30000, profit: 15000, discountAllowed: 1500 },
  { id: 8, date: '2024-06-20', orderNum: 'ORD-008', address: 'Hyderabad', phone: '0307-9900112', customer: 'Sana Tariq', type: 'Wholesale', quantity: 100, paid: 15000, pending: 2000, costOfProduction: 10000, profit: 5000, discountAllowed: 600 },
  { id: 9, date: '2024-06-22', orderNum: 'ORD-009', address: 'Peshawar', phone: '0308-3344556', customer: 'Umar Farooq', type: 'Retail', quantity: 40, paid: 7000, pending: 0, costOfProduction: 4500, profit: 2500, discountAllowed: 400 },
  { id: 10, date: '2024-06-25', orderNum: 'ORD-010', address: 'Quetta', phone: '0309-5566778', customer: 'Fatima Malik', type: 'Wholesale', quantity: 250, paid: 38000, pending: 7000, costOfProduction: 25000, profit: 13000, discountAllowed: 1200 },
]

const DEMO_PARTNERS = [
  { id: 1, partner: 'Daniyal', date: '2024-01-01', reason: 'Accounting', role: 'Accounting', capital: 150000, profit: 22000, drawings: 8000, wages: 12000, salesCommission: 3000 },
  { id: 2, partner: 'Saim', date: '2024-01-01', reason: 'Design', role: 'Shirt Designer', capital: 120000, profit: 18000, drawings: 5000, wages: 10000, salesCommission: 2500 },
  { id: 3, partner: 'Abdul Aziz', date: '2024-01-01', reason: 'Sales', role: 'Sales', capital: 100000, profit: 15000, drawings: 4000, wages: 8000, salesCommission: 4000 },
  { id: 4, partner: 'Abdul Wahab', date: '2024-01-01', reason: 'Investor', role: 'Investor', capital: 90000, profit: 13000, drawings: 3500, wages: 7000, salesCommission: 2000 },
  { id: 5, partner: 'Abdul Bari', date: '2024-01-01', reason: 'Investor', role: 'Investor', capital: 80000, profit: 11000, drawings: 3000, wages: 6000, salesCommission: 1500 },
]
// ── SIDEBAR ──
function Sidebar({ active, setActive, open, setOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shirts', label: 'Shirts', icon: Shirt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'partners', label: 'Partners', icon: Handshake },
  ]

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>STARKET</h1>
          <p>BUSINESS MANAGER</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => { setActive(item.id); setOpen(false) }}
              >
                <Icon className="nav-icon" />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          © 2026 STARKET
        </div>
      </aside>
    </>
  )
}

// ── TOPBAR ──
function Topbar({ page, setOpen }) {
  const titles = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your business' },
    shirts: { title: 'Shirts', subtitle: 'Manage shirt production costs' },
    customers: { title: 'Customers', subtitle: 'Track orders & payments' },
    partners: { title: 'Partners', subtitle: 'Manage partner accounts' },
  }
  const { title, subtitle } = titles[page] || titles.dashboard

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-subtitle">{subtitle}</div>
      </div>
      <div className="topbar-right">
        <button className="hamburger" onClick={() => setOpen(o => !o)}>
          <Menu size={22} />
        </button>
      </div>
    </header>
  )
}

// ── MODAL ──
function Modal({ title, onClose, children, onSave }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>
            <Save size={14} /> Save Record
          </button>
        </div>
      </div>
    </div>
  )
}
// ── DASHBOARD ──
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return val
}

function AnimatedStat({ value, prefix = '', suffix = '' }) {
  const num = useCountUp(typeof value === 'number' ? value : 0)
  if (typeof value !== 'number') return <>{value}</>
  return <>{prefix}{num.toLocaleString()}{suffix}</>
}

function Dashboard({ shirts, customers, partners }) {
  const totalRevenue = customers.reduce((s, c) => s + (c.paid || 0), 0)
  const totalPending = customers.reduce((s, c) => s + (c.pending || 0), 0)
  const totalProfit = customers.reduce((s, c) => s + (c.profit || 0), 0)
  const totalCapital = partners.reduce((s, p) => s + (p.capital || 0), 0)

  const stats = [
    { label: 'Total Revenue', value: `Rs ${totalRevenue.toLocaleString()}`, rawValue: totalRevenue, prefix: 'Rs ', icon: DollarSign, color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
    { label: 'Pending Payments', value: `Rs ${totalPending.toLocaleString()}`, rawValue: totalPending, prefix: 'Rs ', icon: TrendingDown, color: '#ff6584', bg: 'rgba(255,101,132,0.12)' },
    { label: 'Total Profit', value: `Rs ${totalProfit.toLocaleString()}`, rawValue: totalProfit, prefix: 'Rs ', icon: TrendingUp, color: '#43e97b', bg: 'rgba(67,233,123,0.12)' },
    { label: 'Partner Capital', value: `Rs ${totalCapital.toLocaleString()}`, rawValue: totalCapital, prefix: 'Rs ', icon: Handshake, color: '#f9a825', bg: 'rgba(249,168,37,0.12)' },
    { label: 'Total Orders', value: customers.length, rawValue: customers.length, prefix: '', icon: Package, color: '#29b6f6', bg: 'rgba(41,182,246,0.12)' },
    { label: 'Shirt Types', value: shirts.length, rawValue: shirts.length, prefix: '', icon: Shirt, color: '#ab47bc', bg: 'rgba(171,71,188,0.12)' },
  ]

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2>Welcome back 👋</h2>
          <p>Here's what's happening with STARKET today</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div className="stat-card" key={i}>
              <div className="stat-icon" style={{ background: s.bg }}>
                <Icon size={20} color={s.color} />
              </div>
              <div className="stat-value">
                {typeof s.rawValue === 'number'
                  ? <AnimatedStat value={s.rawValue} prefix={s.prefix} />
                  : s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          )
        })}
      </div>

      <div className="table-wrapper" style={{ marginBottom: 24 }}>
        <div className="table-header">
          <h3>Recent Orders</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map(c => (
                <tr key={c.id}>
                  <td className="primary">{c.orderNum}</td>
                  <td>{c.customer}</td>
                  <td>{c.date}</td>
                  <td>{c.quantity}</td>
                  <td style={{ color: '#43e97b' }}>Rs {(c.paid || 0).toLocaleString()}</td>
                  <td style={{ color: '#ff6584' }}>Rs {(c.pending || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${c.pending > 0 ? 'badge-red' : 'badge-green'}`}>
                      {c.pending > 0 ? 'Pending' : 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <h3>Partner Summary</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Capital</th>
                <th>Profit</th>
                <th>Drawings</th>
                <th>Wages</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id}>
                  <td className="primary">{p.partner}</td>
                  <td>Rs {(p.capital || 0).toLocaleString()}</td>
                  <td style={{ color: '#43e97b' }}>Rs {(p.profit || 0).toLocaleString()}</td>
                  <td style={{ color: '#ff6584' }}>Rs {(p.drawings || 0).toLocaleString()}</td>
                  <td>Rs {(p.wages || 0).toLocaleString()}</td>
                  <td>Rs {(p.salesCommission || 0).toLocaleString()}</td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No partners yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
// ── SHIRTS PAGE ──
function ShirtsPage({ shirts, setShirts }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    type: '', shirt: '', printing: '', carriageInward: '',
    otherExpenses: '', reserve: '', costOfProduction: ''
  })

  const resetForm = () => setForm({
    type: '', shirt: '', printing: '', carriageInward: '',
    otherExpenses: '', reserve: '', costOfProduction: ''
  })

  const openAdd = () => { resetForm(); setEditItem(null); setShowModal(true) }
  const openEdit = (item) => { setForm({ ...item }); setEditItem(item); setShowModal(true) }

  const calcCost = (f) => {
    return (
      (parseFloat(f.shirt) || 0) +
      (parseFloat(f.printing) || 0) +
      (parseFloat(f.carriageInward) || 0) +
      (parseFloat(f.otherExpenses) || 0) +
      (parseFloat(f.reserve) || 0)
    )
  }

  const handleSave = async () => {
    const cost = calcCost(form)
    const dbRecord = {
      type: form.type, shirt: form.shirt, printing: form.printing,
      carriage_inward: form.carriageInward, other_expenses: form.otherExpenses,
      reserve: form.reserve, cost_of_production: cost
    }
    if (editItem) {
      const { data } = await supabase.from('shirts').update(dbRecord).eq('id', editItem.id).select().single()
      if (data) setShirts(prev => prev.map(s => s.id === editItem.id ? { ...form, costOfProduction: cost, id: data.id } : s))
    } else {
      const { data } = await supabase.from('shirts').insert(dbRecord).select().single()
      if (data) setShirts(prev => [...prev, { ...form, costOfProduction: cost, id: data.id }])
    }
    setShowModal(false)
    resetForm()
  }

  const handleDelete = async (id) => {
    await supabase.from('shirts').delete().eq('id', id)
    setShirts(prev => prev.filter(s => s.id !== id))
  }

  const filtered = shirts.filter(s =>
    s.type?.toLowerCase().includes(search.toLowerCase())
  )

  const f = (v) => setForm(p => {
    const updated = { ...p, ...v }
    return updated
  })

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2>Shirts</h2>
          <p>Track production costs for each shirt type</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Shirt
        </button>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <h3>Shirt Records</h3>
          <div className="table-search">
            <Search size={14} color="var(--text-muted)" />
            <input
              placeholder="Search by type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Shirt Cost</th>
                <th>Printing</th>
                <th>Carriage Inward</th>
                <th>Other Expenses</th>
                <th>Reserve</th>
                <th>Cost of Production</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td className="primary">{s.type}</td>
                  <td>Rs {(parseFloat(s.shirt) || 0).toLocaleString()}</td>
                  <td>Rs {(parseFloat(s.printing) || 0).toLocaleString()}</td>
                  <td>Rs {(parseFloat(s.carriageInward) || 0).toLocaleString()}</td>
                  <td>Rs {(parseFloat(s.otherExpenses) || 0).toLocaleString()}</td>
                  <td>Rs {(parseFloat(s.reserve) || 0).toLocaleString()}</td>
                  <td><span className="badge badge-purple">Rs {(parseFloat(s.costOfProduction) || 0).toLocaleString()}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Edit2 size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', marginTop: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.12)' }}>
            <Shirt size={20} color="#6c63ff" />
          </div>
          <div className="stat-value">{shirts.length}</div>
          <div className="stat-label">Shirt Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67,233,123,0.12)' }}>
            <DollarSign size={20} color="#43e97b" />
          </div>
          <div className="stat-value">Rs {shirts.reduce((s, i) => s + (parseFloat(i.costOfProduction) || 0), 0).toLocaleString()}</div>
          <div className="stat-label">Total Cost of Production</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249,168,37,0.12)' }}>
            <Package size={20} color="#f9a825" />
          </div>
          <div className="stat-value">Rs {shirts.reduce((s, i) => s + (parseFloat(i.printing) || 0), 0).toLocaleString()}</div>
          <div className="stat-label">Total Printing Cost</div>
        </div>
      </div>

      {showModal && (
        <Modal
          title={editItem ? 'Edit Shirt' : 'Add Shirt'}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-group">
            <label className="form-label">Type</label>
            <input className="form-input" placeholder="e.g. Polo, T-Shirt" value={form.type} onChange={e => f({ type: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Shirt Cost (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.shirt} onChange={e => f({ shirt: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Printing (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.printing} onChange={e => f({ printing: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Carriage Inward (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.carriageInward} onChange={e => f({ carriageInward: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Other Expenses (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.otherExpenses} onChange={e => f({ otherExpenses: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reserve (Rs)</label>
            <input className="form-input" type="number" placeholder="0" value={form.reserve} onChange={e => f({ reserve: e.target.value })} />
          </div>
          <div className="stat-card" style={{ padding: 16, marginTop: 8 }}>
            <div className="stat-label">Auto-calculated Cost of Production</div>
            <div className="stat-value" style={{ fontSize: 22, marginTop: 6, color: 'var(--accent)' }}>
              Rs {calcCost(form).toLocaleString()}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
// ── CUSTOMERS PAGE ──
function CustomersPage({ customers, setCustomers }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    date: '', orderNum: '', address: '', phone: '',
    customer: '', type: '', quantity: '', paid: '',
    totalAmount: '', pending: '', costOfProduction: '', profit: '', discountAllowed: ''
  })

  const resetForm = () => setForm({
    date: '', orderNum: '', address: '', phone: '',
    customer: '', type: '', quantity: '', paid: '',
    totalAmount: '', pending: '', costOfProduction: '', profit: '', discountAllowed: ''
  })

  const openAdd = () => { resetForm(); setEditItem(null); setShowModal(true) }
  const openEdit = (item) => { setForm({ ...item }); setEditItem(item); setShowModal(true) }

  const handleSave = async () => {
    const dbRecord = {
      date: form.date, order_num: form.orderNum, address: form.address,
      phone: form.phone, customer: form.customer, type: form.type,
      quantity: form.quantity, paid: form.paid, pending: form.pending,
      cost_of_production: form.costOfProduction, profit: form.profit,
      discount_allowed: form.discountAllowed
    }
    if (editItem) {
      const { data } = await supabase.from('customers').update(dbRecord).eq('id', editItem.id).select().single()
      if (data) setCustomers(prev => prev.map(c => c.id === editItem.id ? { ...form, id: data.id } : c))
    } else {
      const { data } = await supabase.from('customers').insert(dbRecord).select().single()
      if (data) setCustomers(prev => [...prev, { ...form, id: data.id }])
    }
    setShowModal(false)
    resetForm()
  }

  const handleDelete = async (id) => {
    await supabase.from('customers').delete().eq('id', id)
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  const filtered = customers.filter(c =>
    c.customer?.toLowerCase().includes(search.toLowerCase()) ||
    c.orderNum?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPaid = customers.reduce((s, c) => s + (parseFloat(c.paid) || 0), 0)
  const totalPending = customers.reduce((s, c) => s + (parseFloat(c.pending) || 0), 0)
  const totalProfit = customers.reduce((s, c) => s + (parseFloat(c.profit) || 0), 0)

  const f = (v) => setForm(p => {
    const updated = { ...p, ...v }
    const paid = parseFloat(updated.paid) || 0
    const total = parseFloat(updated.totalAmount) || 0
    const cop = parseFloat(updated.costOfProduction) || 0
    updated.pending = total > 0 ? String(Math.max(0, total - paid)) : updated.pending
    updated.profit = cop > 0 ? String(Math.max(0, paid - cop)) : updated.profit
    return updated
  })

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2>Customers</h2>
          <p>Track all orders, payments and profits</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="table-wrapper">
        <div className="table-header">
          <h3>Customer Records</h3>
          <div className="table-search">
            <Search size={14} color="var(--text-muted)" />
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Cost of Prod.</th>
                <th>Profit</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>{c.date}</td>
                  <td className="primary">{c.orderNum}</td>
                  <td className="primary">{c.customer}</td>
                  <td>{c.phone}</td>
                  <td><span className="badge badge-purple">{c.type}</span></td>
                  <td>{c.quantity}</td>
                  <td style={{ color: '#43e97b' }}>Rs {(parseFloat(c.paid) || 0).toLocaleString()}</td>
                  <td style={{ color: '#ff6584' }}>Rs {(parseFloat(c.pending) || 0).toLocaleString()}</td>
                  <td>Rs {(parseFloat(c.costOfProduction) || 0).toLocaleString()}</td>
                  <td style={{ color: '#43e97b' }}>Rs {(parseFloat(c.profit) || 0).toLocaleString()}</td>
                  <td>Rs {(parseFloat(c.discountAllowed) || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${parseFloat(c.pending) > 0 ? 'badge-red' : 'badge-green'}`}>
                      {parseFloat(c.pending) > 0 ? 'Pending' : 'Paid'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}><Edit2 size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={13} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.12)' }}>
            <Users size={20} color="#6c63ff" />
          </div>
          <div className="stat-value">{customers.length}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67,233,123,0.12)' }}>
            <DollarSign size={20} color="#43e97b" />
          </div>
          <div className="stat-value">Rs {totalPaid.toLocaleString()}</div>
          <div className="stat-label">Total Paid</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,101,132,0.12)' }}>
            <TrendingDown size={20} color="#ff6584" />
          </div>
          <div className="stat-value">Rs {totalPending.toLocaleString()}</div>
          <div className="stat-label">Total Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67,233,123,0.12)' }}>
            <TrendingUp size={20} color="#43e97b" />
          </div>
          <div className="stat-value">Rs {totalProfit.toLocaleString()}</div>
          <div className="stat-label">Total Profit</div>
        </div>
      </div>

      {showModal && (
        <Modal
          title={editItem ? 'Edit Customer' : 'Add Customer'}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => f({ date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Order Number</label>
              <input className="form-input" placeholder="ORD-001" value={form.orderNum} onChange={e => f({ orderNum: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input className="form-input" placeholder="Full name" value={form.customer} onChange={e => f({ customer: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="0300-0000000" value={form.phone} onChange={e => f({ phone: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="City / Area" value={form.address} onChange={e => f({ address: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => f({ type: e.target.value })}>
                <option value="">Select type</option>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" placeholder="0" value={form.quantity} onChange={e => f({ quantity: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Discount Allowed (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.discountAllowed} onChange={e => f({ discountAllowed: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Total Amount (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.totalAmount} onChange={e => f({ totalAmount: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Paid (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.paid} onChange={e => f({ paid: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pending (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.pending} readOnly
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Cost of Production (Rs)</label>
              <input className="form-input" type="number" placeholder="0" value={form.costOfProduction} onChange={e => f({ costOfProduction: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Profit (Rs)</label>
            <input className="form-input" type="number" placeholder="0" value={form.profit} readOnly
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>
        </Modal>
      )}
    </div>
  )
}
// ── PARTNERS PAGE ──
function PartnersPage({ partners, setPartners }) {
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({
    partner: '', date: '', reason: '', capital: '',
    profit: '', drawings: '', wages: '', salesCommission: ''
  })

  const resetForm = () => setForm({
    partner: '', date: '', reason: '', capital: '',
    profit: '', drawings: '', wages: '', salesCommission: ''
  })

  const openEdit = (item) => { setForm({ ...item }); setEditItem(item); setShowModal(true) }

  const handleSave = async () => {
    const dbRecord = {
      partner: form.partner, date: form.date, reason: form.reason,
      role: form.role, capital: form.capital, profit: form.profit, drawings: form.drawings,
      wages: form.wages, sales_commission: form.salesCommission
    }
    if (editItem) {
      const { data } = await supabase.from('partners').update(dbRecord).eq('id', editItem.id).select().single()
      if (data) setPartners(prev => prev.map(p => p.id === editItem.id ? { ...form, id: data.id } : p))
    }
    setShowModal(false)
    resetForm()
  }

  const totalCapital = partners.reduce((s, p) => s + (parseFloat(p.capital) || 0), 0)
  const totalProfit = partners.reduce((s, p) => s + (parseFloat(p.profit) || 0), 0)
  const totalDrawings = partners.reduce((s, p) => s + (parseFloat(p.drawings) || 0), 0)
  const totalWages = partners.reduce((s, p) => s + (parseFloat(p.wages) || 0), 0)

  const avatarColors = [
    { bg: 'rgba(108,99,255,0.15)', color: '#6c63ff', border: 'rgba(108,99,255,0.4)' },
    { bg: 'rgba(255,101,132,0.15)', color: '#ff6584', border: 'rgba(255,101,132,0.4)' },
    { bg: 'rgba(67,233,123,0.15)', color: '#43e97b', border: 'rgba(67,233,123,0.4)' },
    { bg: 'rgba(249,168,37,0.15)', color: '#f9a825', border: 'rgba(249,168,37,0.4)' },
    { bg: 'rgba(41,182,246,0.15)', color: '#29b6f6', border: 'rgba(41,182,246,0.4)' },
  ]

  const f = (v) => setForm(p => ({ ...p, ...v }))

  const activePartner = selected !== null ? partners[selected] : null
  const COLS = 3 // matches minmax(260px) on most screens

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h2>Partners</h2>
          <p>Capital, profit and account overview for all partners</p>
        </div>
      </div>

      {/* PARTNER CARDS — row-aware with inline detail */}
      <div style={{ marginBottom: '40px' }}>
        <style>{`
          @keyframes detailSlideDown {
            from { opacity: 0; transform: translateY(-12px); max-height: 0; }
            to { opacity: 1; transform: translateY(0); max-height: 800px; }
          }
          @keyframes detailSlideUp {
            from { opacity: 1; max-height: 800px; }
            to { opacity: 0; max-height: 0; }
          }
        `}</style>

        {(() => {
          const COLS = window.innerWidth >= 1100 ? 3 : window.innerWidth >= 700 ? 2 : 1
          const rows = []
          for (let i = 0; i < partners.length; i += COLS) {
            rows.push(partners.slice(i, i + COLS).map((p, offset) => ({
              ...p,
              globalIndex: i + offset
            })))
          }

          return rows.map((rowPartners, rowIndex) => {
            const selectedInRow = rowPartners.find(p => p.globalIndex === selected)
            const ac = selected !== null ? avatarColors[selected % avatarColors.length] : null

            return (
              <div key={rowIndex}>
                {/* Card row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gap: '24px',
                  marginBottom: selectedInRow ? '0' : '24px'
                }}>
                  {rowPartners.map((p) => {
                    const i = p.globalIndex
                    const pac = avatarColors[i % avatarColors.length]
                    const isSelected = selected === i
                    const initials = p.partner?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    const totalValue = (parseFloat(p.capital) || 0) + (parseFloat(p.profit) || 0)

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelected(isSelected ? null : i)}
                        style={{
                          background: isSelected
                            ? `linear-gradient(145deg, ${pac.bg}, rgba(0,0,0,0.15))`
                            : 'var(--bg-card)',
                          border: `1px solid ${isSelected ? pac.border : 'var(--border)'}`,
                          borderRadius: '20px',
                          padding: '32px 28px',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                          transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                          boxShadow: isSelected ? `0 16px 48px ${pac.color}20` : '0 2px 8px rgba(0,0,0,0.15)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'translateY(-3px)'
                            e.currentTarget.style.borderColor = pac.border
                            e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.2)`
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.borderColor = 'var(--border)'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        {/* Top accent bar */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                          background: isSelected
                            ? `linear-gradient(90deg, ${pac.color}, ${pac.color}44)`
                            : `linear-gradient(90deg, ${pac.color}33, transparent)`,
                          transition: 'all 0.3s ease'
                        }} />

                        {/* BG watermark */}
                        <div style={{
                          position: 'absolute', bottom: '-10px', right: '-8px',
                          fontSize: '72px', opacity: 0.04, pointerEvents: 'none',
                          fontWeight: '900', color: pac.color, lineHeight: 1
                        }}>{initials}</div>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                              width: '56px', height: '56px', borderRadius: '14px',
                              background: pac.bg, border: `2px solid ${pac.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '18px', fontWeight: '900', color: pac.color,
                              flexShrink: 0, boxShadow: `0 4px 14px ${pac.color}20`
                            }}>{initials}</div>
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>{p.partner}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{p.role}</div>
                            </div>
                          </div>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: `${pac.color}33`,
                            border: `1px solid ${pac.color}99`,
                            fontSize: '10px',
                            fontWeight: '700',
                            color: pac.color,
                            letterSpacing: '0.5px',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            lineHeight: '1.4'
                          }}>
                            {p.role}
                          </span>
                        </div>

                        {/* Divider */}
                        <div style={{
                          height: '1px', marginBottom: '20px',
                          background: `linear-gradient(90deg, ${pac.color}30, transparent)`
                        }} />

                        {/* Stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                          {[
                            { label: 'Capital', value: p.capital, color: pac.color, icon: '💰' },
                            { label: 'Profit', value: p.profit, color: '#43e97b', icon: '📈' },
                            { label: 'Drawings', value: p.drawings, color: '#ff6584', icon: '📤' },
                          ].map((item, j) => (
                            <div key={j} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '9px 12px', borderRadius: '10px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <span style={{ fontSize: '12px' }}>{item.icon}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</span>
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: '800', color: item.color }}>
                                Rs {(parseFloat(item.value) || 0).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total + click hint */}
                        <div style={{
                          padding: '10px 14px', borderRadius: '10px',
                          background: `${pac.color}10`,
                          border: `1px solid ${pac.color}25`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL VALUE</span>
                          <span style={{ fontSize: '14px', fontWeight: '900', color: pac.color }}>
                            Rs {totalValue.toLocaleString()}
                          </span>
                        </div>

                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          padding: '7px', borderRadius: '10px',
                          background: isSelected ? `${pac.color}12` : 'transparent',
                          border: `1px dashed ${isSelected ? pac.color + '50' : 'rgba(255,255,255,0.1)'}`,
                          transition: 'all 0.25s ease'
                        }}>
                          <span style={{ fontSize: '10px', color: isSelected ? pac.color : 'var(--text-muted)' }}>
                            {isSelected ? '▲' : '▼'}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '600', color: isSelected ? pac.color : 'var(--text-muted)', letterSpacing: '0.5px' }}>
                            {isSelected ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                          </span>
                        </div>
                      </div>
                    )
                  })}

                  {/* Fill empty grid slots in last row */}
                  {rowPartners.length < COLS && Array.from({ length: COLS - rowPartners.length }).map((_, k) => (
                    <div key={`empty-${k}`} />
                  ))}
                </div>

                {/* Detail panel — only shows under this row if selected card is in this row */}
                {selectedInRow && (
                  <div style={{
                    marginTop: '12px',
                    marginBottom: '24px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    animation: 'detailSlideDown 0.4s cubic-bezier(0.4,0,0.2,1) forwards'
                  }}>
                    <div style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${ac.border}`,
                      borderRadius: '20px',
                      padding: '32px',
                      boxShadow: `0 8px 40px ${ac.color}15`,
                      position: 'relative', overflow: 'hidden'
                    }}>
                      {/* Top accent */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: `linear-gradient(90deg, ${ac.color}, ${ac.color}33)`
                      }} />

                      {/* Header */}
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '24px', flexWrap: 'wrap', gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: ac.bg, border: `2px solid ${ac.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', fontWeight: '900', color: ac.color,
                            boxShadow: `0 4px 16px ${ac.color}25`
                          }}>
                            {activePartner.partner?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
                              {activePartner.partner}
                            </div>
                            <div style={{
                              fontSize: '13px', color: 'var(--text-muted)',
                              display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                              <span style={{
                                padding: '2px 10px', borderRadius: '20px',
                                background: ac.bg, border: `1px solid ${ac.border}`,
                                fontSize: '11px', fontWeight: '700', color: ac.color
                              }}>{activePartner.role}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(activePartner) }}>
                            <Edit2 size={13} /> Edit
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(null) }} style={{ padding: '6px 10px' }}>
                            <X size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{
                        height: '1px', marginBottom: '24px',
                        background: `linear-gradient(90deg, ${ac.color}40, transparent)`
                      }} />

                      {/* Detail stats */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '14px'
                      }}>
                        {[
                          { label: 'Capital Invested', value: activePartner.capital, color: ac.color, icon: '💰' },
                          { label: 'Profit Share', value: activePartner.profit, color: '#43e97b', icon: '📈' },
                          { label: 'Drawings', value: activePartner.drawings, color: '#ff6584', icon: '📤' },
                          { label: 'Wages', value: activePartner.wages, color: '#f9a825', icon: '💵' },
                          { label: 'Sales Commission', value: activePartner.salesCommission, color: '#29b6f6', icon: '🏷️' },
                        ].map((item, idx) => (
                          <div key={idx} style={{
                            padding: '20px',
                            background: `${item.color}08`,
                            border: `1px solid ${item.color}25`,
                            borderRadius: '14px',
                            borderTop: `3px solid ${item.color}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '14px' }}>{item.icon}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>{item.label}</span>
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: '900', color: item.color }}>
                              Rs {(parseFloat(item.value) || 0).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        })()}
      </div>

      {/* SUMMARY CARDS */}
      <div className="stats-grid" style={{ marginTop: 8 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.12)' }}>
            <Handshake size={20} color="#6c63ff" />
          </div>
          <div className="stat-value">{partners.length}</div>
          <div className="stat-label">Total Partners</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(41,182,246,0.12)' }}>
            <DollarSign size={20} color="#29b6f6" />
          </div>
          <div className="stat-value">Rs {totalCapital.toLocaleString()}</div>
          <div className="stat-label">Total Capital</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67,233,123,0.12)' }}>
            <TrendingUp size={20} color="#43e97b" />
          </div>
          <div className="stat-value">Rs {totalProfit.toLocaleString()}</div>
          <div className="stat-label">Total Profit</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,101,132,0.12)' }}>
            <TrendingDown size={20} color="#ff6584" />
          </div>
          <div className="stat-value">Rs {totalDrawings.toLocaleString()}</div>
          <div className="stat-label">Total Drawings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249,168,37,0.12)' }}>
            <DollarSign size={20} color="#f9a825" />
          </div>
          <div className="stat-value">Rs {totalWages.toLocaleString()}</div>
          <div className="stat-label">Total Wages</div>
        </div>
      </div>

      {showModal && (
        <Modal
          title="Edit Partner"
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        >
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Partner Name</label>
              <input className="form-input" value={form.partner} onChange={e => f({ partner: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => f({ date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <input className="form-input" value={form.reason} onChange={e => f({ reason: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Capital (Rs)</label>
              <input className="form-input" type="number" value={form.capital} onChange={e => f({ capital: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Profit (Rs)</label>
              <input className="form-input" type="number" value={form.profit} onChange={e => f({ profit: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Drawings (Rs)</label>
              <input className="form-input" type="number" value={form.drawings} onChange={e => f({ drawings: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Wages (Rs)</label>
              <input className="form-input" type="number" value={form.wages} onChange={e => f({ wages: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Sales Commission (Rs)</label>
            <input className="form-input" type="number" value={form.salesCommission} onChange={e => f({ salesCommission: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  )
}



// ── MAIN APP ──
export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [shirts, setShirts] = useState([])
  const [customers, setCustomers] = useState([])
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [minTimeDone, setMinTimeDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setMinTimeDone(true), 600)
    }, 4200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [s, c, p] = await Promise.all([
        supabase.from('shirts').select('*').order('id'),
        supabase.from('customers').select('*').order('id'),
        supabase.from('partners').select('*').order('id'),
      ])
      if (s.data) setShirts(s.data.map(r => ({
        id: r.id, type: r.type, shirt: r.shirt, printing: r.printing,
        carriageInward: r.carriage_inward, otherExpenses: r.other_expenses,
        reserve: r.reserve, costOfProduction: r.cost_of_production
      })))
      if (c.data) setCustomers(c.data.map(r => ({
        id: r.id, date: r.date, orderNum: r.order_num, address: r.address,
        phone: r.phone, customer: r.customer, type: r.type, quantity: r.quantity,
        paid: r.paid, pending: r.pending, costOfProduction: r.cost_of_production,
        profit: r.profit, discountAllowed: r.discount_allowed
      })))
      if (p.data) setPartners(p.data.map(r => ({
        id: r.id, partner: r.partner, date: r.date, reason: r.reason,
        role: r.role, capital: r.capital, profit: r.profit, drawings: r.drawings,
        wages: r.wages, salesCommission: r.sales_commission
      })))
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading || !minTimeDone) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: 0,
      background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: fadeOut ? 'none' : 'all'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes masterFlow {
          0%   { opacity: 0; transform: translateY(-140px) rotate(-18deg); }
          8%   { opacity: 1; transform: translateY(10px) rotate(3deg); }
          12%  { transform: translateY(-5px) rotate(-1deg); }
          16%  { transform: translateY(0px) rotate(0deg); }
          16.1%{ opacity: 1; }
          100% { opacity: 1; transform: translateY(0px) rotate(0deg); }
        }
        @keyframes textReveal1 {
          0%, 18% { opacity: 0; transform: translateY(16px); }
          30%, 100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes textReveal2 {
          0%, 26% { opacity: 0; transform: translateY(16px); }
          38%, 100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes barReveal {
          0%, 30% { opacity: 0; }
          32% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes barProgress {
          0%, 30% { width: 0%; }
          35% { width: 8%; }
          50% { width: 35%; }
          65% { width: 62%; }
          80% { width: 82%; }
          92% { width: 95%; }
          100% { width: 100%; }
        }
        @keyframes dotsReveal {
          0%, 35% { opacity: 0; transform: translateY(10px); }
          47%, 100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBlink {
          0%, 100% { transform: scale(0.5); opacity: 0.2; }
          50% { transform: scale(1); opacity: 1; }
        }
        @keyframes hintsReveal {
          0%, 55% { opacity: 0; transform: translateY(12px); }
          70%, 100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bgGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.06); }
        }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'bgGrid 3s linear infinite'
        }} />
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'glowPulse 3s ease-in-out infinite'
        }} />
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

        {/* Shirt icon */}
        <div style={{
          fontSize: '72px', lineHeight: 1,
          marginBottom: '28px',
          filter: 'drop-shadow(0 8px 24px rgba(108,99,255,0.35))',
          animation: `masterFlow 4.2s ease forwards`
        }}>👔</div>

        {/* Brand name */}
        <div style={{
          fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px',
          color: 'var(--text-primary)', fontFamily: 'var(--font)',
          marginBottom: '6px',
          animation: 'textReveal1 4.2s ease forwards'
        }}>STARKET</div>

        {/* Tagline */}
        <div style={{
          fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500',
          letterSpacing: '3.5px', textTransform: 'uppercase',
          marginBottom: '44px',
          animation: 'textReveal2 4.2s ease forwards'
        }}>Business Manager</div>

        {/* Progress bar */}
        <div style={{
          width: '260px', marginBottom: '18px',
          animation: 'barReveal 4.2s ease forwards'
        }}>
          <div style={{
            height: '3px', borderRadius: '2px',
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
              boxShadow: '0 0 10px rgba(108,99,255,0.5)',
              animation: 'barProgress 4.2s ease forwards'
            }} />
          </div>
        </div>

        {/* Loading dots */}
        <div style={{
          display: 'flex', gap: '6px', alignItems: 'center',
          animation: 'dotsReveal 4.2s ease forwards'
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#6c63ff',
              animation: `dotBlink 1.3s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
          <span style={{
            fontSize: '12px', color: 'var(--text-muted)',
            marginLeft: '10px', fontWeight: '500'
          }}>Loading your data...</span>
        </div>

        {/* Hints */}
        <div style={{
          display: 'flex', gap: '28px', marginTop: '52px',
          animation: 'hintsReveal 4.2s ease forwards'
        }}>
          {[
            { icon: '👔', label: 'Shirts' },
            { icon: '👥', label: 'Customers' },
            { icon: '🤝', label: 'Partners' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '7px'
            }}>
              <div style={{ fontSize: '22px' }}>{item.icon}</div>
              <div style={{
                fontSize: '10px', color: 'var(--text-muted)',
                fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase'
              }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <Sidebar
        active={page}
        setActive={setPage}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="main-content">
        <Topbar page={page} setOpen={setSidebarOpen} />
        <main className="page-content">
          {page === 'dashboard' && (
            <Dashboard
              shirts={shirts}
              customers={customers}
              partners={partners}
            />
          )}
          {page === 'shirts' && (
            <ShirtsPage
              shirts={shirts}
              setShirts={setShirts}
            />
          )}
          {page === 'customers' && (
            <CustomersPage
              customers={customers}
              setCustomers={setCustomers}
            />
          )}
          {page === 'partners' && (
            <PartnersPage
              partners={partners}
              setPartners={setPartners}
            />
          )}
        </main>
      </div>
    </div>
  )
}