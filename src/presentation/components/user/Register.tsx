


import { SetStateAction, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  LockOpenIcon as LockClosedIcon,
  UserIcon,
  InboxIcon as EnvelopeIcon,
} from "lucide-react"
import toast from "react-hot-toast"
import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../../../data/api/userApi"

const RegisterForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation()
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation()
  const [registerUser, { isLoading: registering }] = useRegisterMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!name.trim()) errors.name = "Name is required"
    else if (name.trim().length < 4) errors.name = "Name must be at least 4 characters"

    if (!email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format"

    if (!password) errors.password = "Password is required"
    else if (password.length < 6) errors.password = "Password must be at least 6 characters"

    if (!otp) errors.otp = "OTP is required"
    else if (!/^\d{6}$/.test(otp)) errors.otp = "OTP must be 6 digits"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSendOtp = async () => {
    if (!email || formErrors.email) {
      setFormErrors((prev) => ({
        ...prev,
        email: !email ? "Email is required" : "Invalid email format",
      }))
      return
    }

    try {
      await sendOtp({ email }).unwrap()
      toast.success("OTP sent to email")
      setOtpSent(true)
      setCooldown(30)
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to send OTP")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!otpSent) {
      toast.error("Please send OTP first")
      return
    }

    try {
      await verifyOtp({ email, otp }).unwrap()
      toast.success("OTP verified")

      await registerUser({ name, email, password }).unwrap()
      toast.success("Registration successful")
      navigate("/login")
    } catch (err: any) {
      toast.error(err?.data?.error || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0c75] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#2e1e9c] rounded-2xl shadow-xl p-8 space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#ece6ff]">
            Create your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <InputField
              icon={<UserIcon className="h-5 w-5 text-purple-300" />}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setName(e.target.value)}
              error={formErrors.name}
            />
            <InputField
              icon={<EnvelopeIcon className="h-5 w-5 text-purple-300" />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
              error={formErrors.email}
            />
            <InputField
              icon={<LockClosedIcon className="h-5 w-5 text-purple-300" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
              error={formErrors.password}
            />
            <InputField
              icon={<LockClosedIcon className="h-5 w-5 text-purple-300" />}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setOtp(e.target.value)}
              error={formErrors.otp}
            />

            {/* Send/Resend OTP */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp || cooldown > 0}
              className="w-full text-sm text-purple-200 hover:underline disabled:opacity-50"
            >
              {otpSent
                ? cooldown > 0
                  ? `Resend OTP in ${cooldown}s`
                  : "Resend OTP"
                : "Send OTP"}
            </button>
          </div>

          <Button loading={verifyingOtp || registering} label="Register" />
        </form>

        <Link to="/login">
          <p className="text-center mt-3 text-sm text-[#b09fff] hover:text-[#d0c2ff] transition duration-200 ease-in-out">
            Already have an account? Login
          </p>
        </Link>
        
      </div>
    </div>
  )
}

// 👇 Updated InputField with error display
const InputField = ({
  icon,
  error,
  ...props
}: any) => (
  <div className="relative space-y-1">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        {...props}

        className={`appearance-none rounded-md relative block w-full px-4 py-3 pl-10 border ${
          error ? "border-red-400" : "border-transparent"
        } placeholder-[#c4b8ff] text-[#ece6ff] bg-[#3a2aaf] focus:outline-none focus:ring-[#b09fff] focus:border-[#b09fff] transition duration-200 ease-in-out`}
      />
    </div>
    {error && <p className="text-sm text-red-400 ml-1">{error}</p>}
  </div>
)

const Button = ({
  loading,
  label,
}: {
  loading: boolean
  label: string
}) => (
  <button
    type="submit"
    disabled={loading}
    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-[#ece6ff] bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
  >
    {loading ? "Processing..." : label}
  </button>
)

export default RegisterForm