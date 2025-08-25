import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ArrowLeft,
  Zap,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Sparkles,
  Cherry,
  Gift,
  Star,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Check if user is already logged in and handle email confirmation
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/profile');
      }
    };

        // Handle email confirmation from URL parameters
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');

      // Check for error in URL hash (Supabase sometimes puts errors there)
      if (hash.includes('error=')) {
        const errorMatch = hash.match(/error_description=([^&]+)/);
        const errorCode = hash.match(/error_code=([^&]+)/);

        if (errorCode && errorCode[1] === 'otp_expired') {
          setErrors({
            email: "The email verification link has expired. Please request a new one by trying to sign up again."
          });
        } else if (errorMatch) {
          const decodedError = decodeURIComponent(errorMatch[1].replace(/\+/g, ' '));
          setErrors({ email: `Email verification failed: ${decodedError}` });
        }

        // Clear URL parameters and hash
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error) {
          setErrors({ email: "Email confirmed successfully! You can now log in." });
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    checkUser();
    handleEmailConfirmation();
  }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: { [key: string]: string } = {};

    if (!formData.userId) {
      newErrors.userId = "User ID is required";
    }

        if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }

      if (!acceptedTerms) {
        newErrors.terms = "You must accept the Terms and Conditions to sign up";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login user - using email as both email and fake "userId"
        // Since Supabase uses email for auth, we'll treat userId as display name
        const email = formData.email || `${formData.userId}@sourtea.app`;

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (error) {
          setErrors({ password: "Invalid login credentials" });
        } else {
          navigate('/profile');
        }
            } else {
                // Register new user - Use magic link for better email delivery
        const { error } = await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              display_name: formData.userId,
              password: formData.password
            }
          }
        });

                if (error) {
          // If magic link fails, try traditional signup
          const { error: signupError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/login`,
              data: {
                display_name: formData.userId
              }
            }
          });

          if (signupError) {
            setErrors({ email: signupError.message });
          } else {
            setErrors({ email: "Please check your email (including spam folder) for a verification link. Click the link to activate your account." });
          }
        } else {
          setErrors({ email: "Please check your email (including spam folder) for a magic link to complete your registration." });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ password: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-pink-50 via-tea-green-50 to-tea-mint-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-tea-pink-300 opacity-40 animate-pulse">
          <Zap size={28} />
        </div>
        <div className="absolute top-40 right-20 text-tea-green-400 opacity-50 animate-bounce">
          <Heart size={24} className="animate-pulse delay-100" />
        </div>
        <div className="absolute bottom-32 left-16 text-tea-neutral-400 opacity-60">
          <Sparkles size={20} className="animate-pulse delay-200" />
        </div>
        <div className="absolute top-64 left-1/3 text-tea-pink-200 opacity-30">
          <Star size={16} className="animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-20 right-32 text-tea-green-300 opacity-45">
          <Cherry size={22} className="animate-pulse delay-75" />
        </div>
        <div className="absolute top-32 left-2/3 text-tea-neutral-300 opacity-35">
          <Gift size={18} className="animate-pulse delay-150" />
        </div>
        <div className="absolute top-80 right-10 text-tea-pink-200 opacity-30">
          <Heart size={20} className="animate-pulse delay-400" />
        </div>
        <div className="absolute bottom-60 left-24 text-tea-green-200 opacity-40">
          <Cherry size={16} className="animate-pulse delay-500" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-tea-neutral-200 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-tea-neutral-600 hover:text-tea-pink-600 transition-colors p-2 rounded-lg hover:bg-tea-pink-50"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tea-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-tea-neutral-800">
                  Tea Time
                </h1>
              </div>
              <Badge className="bg-tea-green-100 text-tea-green-700 border-tea-green-300 px-3 py-1">
                {isLogin ? "Login" : "Sign Up"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Login/Signup Card */}
          <Card className="bg-white/90 backdrop-blur-md border-tea-neutral-200 shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-tea-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                {isLogin ? (
                  <LogIn className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-tea-neutral-800">
                {isLogin ? "Welcome Back!" : "Join Tea Time"}
              </CardTitle>
              <p className="text-tea-neutral-600 mt-2">
                {isLogin
                  ? "Ready to spill some tea? 🍃"
                  : "Start sharing your stories with the community 🌸"}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User ID Field */}
                <div>
                  <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                    User ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Enter your user ID"
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData({ ...formData, userId: e.target.value })
                      }
                      className={`pl-10 border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 ${
                        errors.userId ? "border-tea-chaos-red" : ""
                      }`}
                    />
                  </div>
                  {errors.userId && (
                    <div className="flex items-center gap-1 mt-1 text-tea-chaos-red text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.userId}
                    </div>
                  )}
                </div>

                                {/* Email Field */}
                {(
                  <div>
                                        <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                      Email {isLogin && "(or leave blank to use User ID)"}
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 ${
                          errors.email ? "border-tea-chaos-red" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-1 mt-1 text-tea-chaos-red text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-5 w-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`pl-10 pr-10 border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 ${
                        errors.password ? "border-tea-chaos-red" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 hover:text-tea-pink-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-1 mt-1 text-tea-chaos-red text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                                {/* Confirm Password Field (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className="text-sm font-medium text-tea-neutral-700 mb-2 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tea-neutral-400 h-5 w-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className={`pl-10 border-tea-neutral-300 focus:border-tea-pink-500 focus:ring-2 focus:ring-tea-pink-200 ${
                          errors.confirmPassword ? "border-tea-chaos-red" : ""
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-1 mt-1 text-tea-chaos-red text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                )}

                {/* Terms and Conditions (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 text-tea-pink-600 border-tea-neutral-300 rounded focus:ring-tea-pink-500"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="terms"
                          className="text-sm text-tea-neutral-700 cursor-pointer leading-relaxed"
                        >
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            target="_blank"
                            className="text-tea-pink-600 hover:text-tea-pink-700 underline font-medium"
                          >
                            Terms and Conditions
                          </Link>{" "}
                          and acknowledge that I am solely responsible for my actions and content on this platform.
                        </label>
                        {errors.terms && (
                          <div className="flex items-center gap-1 mt-1 text-tea-chaos-red text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.terms}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-tea-pink-600 hover:bg-tea-pink-700 text-white py-3 text-lg font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isLogin ? "Logging in..." : "Creating account..."}
                    </div>
                  ) : (
                    <>
                      {isLogin ? (
                        <>
                          <LogIn className="w-5 h-5 mr-2" />
                          Login
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          Sign Up
                        </>
                      )}
                    </>
                  )}
                </Button>

                {/* Toggle Login/Signup */}
                <div className="text-center pt-4">
                  <p className="text-tea-neutral-600">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}{" "}
                    <button
                      type="button"
                                            onClick={() => {
                        setIsLogin(!isLogin);
                        setErrors({});
                        setAcceptedTerms(false);
                        setFormData({
                          userId: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                        });
                      }}
                      className="text-tea-pink-600 hover:text-tea-pink-700 font-medium transition-colors"
                    >
                      {isLogin ? "Sign up" : "Login"}
                    </button>
                  </p>
                </div>

                {/* Forgot Password */}
                {isLogin && (
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-tea-neutral-500 hover:text-tea-pink-600 transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-white/70 backdrop-blur-md border-tea-neutral-200 shadow-lg rounded-2xl mt-6">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-tea-neutral-600 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Safe Community</span>
              </div>
              <p className="text-xs text-tea-neutral-500 leading-relaxed">
                Join a supportive community where you can share relationship
                experiences and get genuine feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
