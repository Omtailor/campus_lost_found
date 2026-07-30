import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../lib/api.js'
import GlassCard from '../../components/ui/GlassCard.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'

function StudentSignup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', roll_no: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
    if (serverError) setServerError('')
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.roll_no.trim()) next.roll_no = 'Roll number is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Invalid email format'
    }
    if (!form.password) {
      next.password = 'Password is required'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    setServerError('')
    try {
      const { data } = await api.post('/api/auth/signup', {
        name: form.name.trim(),
        roll_no: form.roll_no.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      login(data.token, data.user)
      navigate('/student/dashboard')
    } catch (err) {
      const message =
        err.response?.data?.error || 'Something went wrong. Please try again.'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Campus Lost & Found</h1>
          <p className="mt-1 text-sm text-gray-500">Student Sign Up</p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Roll No"
            name="roll_no"
            placeholder="Enter your roll number"
            value={form.roll_no}
            onChange={handleChange}
            error={errors.roll_no}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/student/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </GlassCard>
    </div>
  )
}

export default StudentSignup
