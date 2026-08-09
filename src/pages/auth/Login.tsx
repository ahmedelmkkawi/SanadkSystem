import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import logo from '../../assets/logo.webp';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy, CheckCircle } from '@mui/icons-material';
import { useAppStore } from '../../store/useAppStore';
import { useDevModuleStore } from '../../store/devModuleStore';

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;700;900&family=Inter:wght@400;700;900&display=swap');
  
  .logo-text-style {
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 3px;
      color: #ffcccc;
      text-shadow: 0 0 2px #660000, 0 0 5px #990000, 0 0 10px #ff0000, 0 0 20px #ff0000;
  }
  
  .bg-logo-giant {
      position: absolute;
      right: -80px;
      top: 50px;
      opacity: 0.12;
      filter: blur(12px);
      z-index: 0;
      width: 1000px;
      pointer-events: none;
  }

  .orb {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(220,50,50,0.2), rgba(255,255,255,0.05), transparent);
      animation: randomMove 25s infinite linear;
      z-index: 1;
  }
  @keyframes randomMove {
      0% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(150px, 150px) rotate(180deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
  }
`;

const dict = {
  en: {
    title: "Login",
    btnL: "LOGIN",
    user: "Email Address",
    pass: "Password",
    rem: "Remember me"
  },
  ar: {
    title: "تسجيل الدخول",
    btnL: "دخول",
    user: "البريد الإلكتروني",
    pass: "كلمة المرور",
    rem: "تذكرني"
  }
};

export const Login: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, registeredUsers } = useAppSelector((state) => state.auth);
  const { addActivityLog } = useAppStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const isRtl = i18n.language === 'ar';
  const lang = isRtl ? 'ar' : 'en';

  const onSubmit = (data: any) => {
    dispatch(loginStart());

    // Simulate API JWT auth delay
    setTimeout(() => {
      const match = registeredUsers.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
      );

      if (match) {
        if (match.status === 'Inactive' || match.status === 'Suspended') {
          dispatch(loginFailure(isRtl ? 'حسابك معطل أو معلق. يرجى التواصل مع المسؤول.' : 'Your account is inactive or suspended. Please contact the administrator.'));
          return;
        }

        dispatch(
          loginSuccess({
            user: {
              id: match.id,
              name: match.name,
              email: match.email,
              role: match.role,
              permissions: match.permissions,
              status: match.status,
              department: match.department,
              position: match.position
            },
            token: `mock-jwt-token-${match.role.toLowerCase().replace(/\s+/g, '-')}`
          })
        );

        // Sync dev sandbox role
        useDevModuleStore.getState().setRole(match.role as any);

        addActivityLog(
          'User Login',
          match.name,
          'user',
          `${match.email} logged in successfully as ${match.role}`
        );

        if (match.status === 'Pending First Login') {
          navigate('/auth/force-change-password');
        } else {
          if (match.department === 'Software Development') {
            navigate('/dev/dashboard');
          } else if (match.department === 'Sales') {
            navigate('/crm/dashboard');
          } else if (match.department === 'Training') {
            navigate('/training');
          } else if (match.role === 'CEO') {
            navigate('/dashboard/ceo');
          } else {
            navigate('/');
          }
        }
      } else {
        dispatch(loginFailure(isRtl ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email address or password'));
      }
    }, 1000);
  };

  const toggleLang = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMsg(`${label} copied!`);
    setSnackbarOpen(true);
  };

  const selectDemoUser = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    setSnackbarMsg(`Credentials loaded for ${email}`);
    setSnackbarOpen(true);
  };

  // We read the list of registered users as demo accounts
  const demoAccounts = registeredUsers.filter(u => 
    [
      'ceo@company.com',
      'gm@company.com',
      'hr@company.com',
      'finance@company.com',
      'marketing@company.com',
      'sales.manager@company.com',
      'teamleader@company.com',
      'developer@company.com',
      'techlead@company.com',
      'employee@company.com',
      'client@company.com',
      'training.manager@company.com',
      'instructor@company.com'
    ].includes(u.email.toLowerCase())
  );

  const isDev = import.meta.env.DEV;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#450a0a] flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <style>{customStyles}</style>

      {/* Header Area */}
      <img
        src={logo}
        className={`absolute top-6 ${isRtl ? 'left-8' : 'right-8'} z-20`}
        style={{ height: '75px', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}
        alt="Logo"
      />
      <img src={logo} className="bg-logo-giant" alt="background logo" />

      <button
        onClick={toggleLang}
        className={`absolute top-6 ${isRtl ? 'right-8' : 'left-8'} z-20 bg-white/5 text-white px-5 py-2 rounded-2xl font-bold hover:bg-white/10 transition border border-white/5 backdrop-blur-md`}
      >
        EN / AR
      </button>

      {/* Background Orbs */}
      <div className="orb w-32 h-32" style={{ top: '10%', left: '10%' }}></div>
      <div className="orb w-48 h-48" style={{ top: '50%', left: '15%' }}></div>
      <div className="orb w-40 h-40" style={{ top: '30%', right: '10%' }}></div>

      <h1 className="logo-text-style text-6xl font-black mb-10 z-10 tracking-widest select-none">
        SANADAK
      </h1>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-5xl w-full z-10 mt-2">
        {/* Main Card */}
        <div className="relative w-full max-w-sm p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 to-transparent shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white tracking-tighter">
                {dict[lang].title}
              </h2>
              <div className="w-12 h-1 bg-red-600 mx-auto rounded-full mt-3"></div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-200 text-sm font-semibold backdrop-blur-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  {...register('email', {
                    required: isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: isRtl ? 'عنوان بريد إلكتروني غير صالح' : 'Invalid email address'
                    }
                  })}
                  className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 text-white outline-none focus:ring-2 ring-red-500/30 transition-all placeholder-white/40"
                  placeholder={dict[lang].user}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs font-semibold mt-1 px-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: isRtl ? 'كلمة المرور مطلوبة' : 'Password is required'
                    })}
                    className={`w-full p-4 ${isRtl ? 'pl-12' : 'pr-12'} rounded-2xl border border-white/10 bg-white/5 text-white outline-none focus:ring-2 ring-red-500/30 transition-all placeholder-white/40`}
                    placeholder={dict[lang].pass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${isRtl ? 'left-4' : 'right-4'} flex items-center text-white/40 hover:text-white/80 transition-colors`}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs font-semibold mt-1 px-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm py-1">
                <label className="flex items-center gap-2 text-white/60 cursor-pointer hover:text-white/80 transition-colors select-none">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <span>{dict[lang].rem}</span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-red-950 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 active:scale-[0.98] transition-all mt-4 shadow-lg shadow-red-900/20 flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-red-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  dict[lang].btnL
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Development Mode Helper Sidebar Panel */}
        {isDev && (
          <div className="w-full max-w-sm p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="bg-black/50 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-red-300 tracking-wider">
                    ⚙️ {isRtl ? 'لوحة فحص حسابات التطوير' : 'DEVELOPMENT TESTING PANEL'}
                  </h3>
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider select-none">
                    Dev Only
                  </span>
                </div>

                <p className="text-white/60 text-xs mb-4 leading-relaxed">
                  {isRtl
                    ? 'انقر على أي مستخدم لتعبئة البيانات تلقائياً، أو استخدم أزرار النسخ لتسهيل التجربة.'
                    : 'Click any user profile to auto-populate credentials, or copy them directly using buttons.'}
                </p>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {demoAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => selectDemoUser(acc.email, acc.password || '')}
                      className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-white/10 transition-all cursor-pointer flex justify-between items-start"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-white">
                            {acc.role}
                          </span>
                          {acc.department && (
                            <span className="bg-red-500/10 text-red-300 text-[9px] px-1.5 py-0.5 rounded border border-red-500/20 font-bold">
                              {acc.department === 'Software Development' ? (isRtl ? 'تطوير البرمجيات' : 'Software Development') : acc.department}
                            </span>
                          )}
                          <Tooltip title={acc.permissions.join(', ')} placement="top">
                            <span className="cursor-help bg-white/10 text-white/70 font-mono text-[8px] px-1.5 py-0.5 rounded border border-white/5 select-none">
                              {acc.permissions.length} perms
                            </span>
                          </Tooltip>
                        </div>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5 truncate">{acc.email}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title={isRtl ? 'نسخ البريد' : 'Copy Email'}>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(acc.email, 'Email')}
                            sx={{ p: 0.5 }}
                          >
                            <ContentCopy sx={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isRtl ? 'نسخ كلمة المرور' : 'Copy Password'}>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(acc.password || '', 'Password')}
                            sx={{ p: 0.5 }}
                          >
                            <ContentCopy sx={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-center font-bold text-[9px] text-white/40 uppercase tracking-widest select-none">
                  Protected Admin Model Active
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CheckCircle sx={{ fontSize: 16, color: 'success.light' }} />
          </IconButton>
        }
      />
    </div>
  );
};

export default Login;
