/**
 * Centralized auth API client.
 * All calls go to /api/auth/* (Next.js route handlers).
 * Cookies are sent automatically by the browser (credentials: 'include').
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface ApiUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  address?: string;
  role: 'user' | 'admin' | 'manager';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export class AuthApiError extends Error {
  errors?: Record<string, string>;

  constructor(message: string, errors?: Record<string, string>) {
    super(message);
    this.name = 'AuthApiError';
    this.errors = errors;
  }
}

export interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  address?: string;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`/api/auth${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    ...options,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const raw = await res.text();

  if (!contentType.includes('application/json')) {
    if (res.status === 404) {
      throw new AuthApiError(
        'Sign-in service is unavailable (API not found). Stop the dev server, run npm run clean:cache, then npm run dev again.',
      );
    }
    throw new AuthApiError(
      'Sign-in service returned an unexpected response. Restart the dev server or try again in a moment.',
    );
  }

  let data: ApiResponse<T>;
  try {
    data = JSON.parse(raw) as ApiResponse<T>;
  } catch {
    throw new AuthApiError('Sign-in service returned invalid data. Please try again.');
  }

  if (!res.ok) {
    throw new AuthApiError(data.message || 'Something went wrong. Please try again.', data.errors);
  }

  return data;
}

export const authApi = {
  register: (body: RegisterPayload) =>
    request<{ userId: string; email: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyOtp: (body: VerifyOtpPayload) =>
    request<{ token: string; user: ApiUser }>('/verify-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: LoginPayload) =>
    request<{ token: string; user: ApiUser }>('/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<null>('/logout', { method: 'POST' }),

  getMe: () =>
    request<{ user: ApiUser; sessionExpiresAt?: number }>('/me'),

  updateProfile: (body: UpdateProfilePayload) =>
    request<{ user: ApiUser }>('/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  forgotPassword: (body: ForgotPasswordPayload) =>
    request<null>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resetPassword: (body: ResetPasswordPayload) =>
    request<null>('/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  changePassword: (body: ChangePasswordPayload) =>
    request<null>('/change-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
