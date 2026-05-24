import type {
  ApiTokens,
  ApiUser,
  CreateMealPlanInput,
  DailyLog,
  MealPlan,
  PaginatedFoodNutrition,
  Recipe,
  UpsertDailyLogInput,
} from './types';

const DEFAULT_API_URL = 'http://10.0.2.2:4000/api';

type ApiClientOptions = {
  baseUrl?: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  onTokensRefreshed?: (tokens: ApiTokens) => void | Promise<void>;
  onUnauthorized?: () => void | Promise<void>;
};

type RequestOptions = {
  auth?: boolean;
  body?: unknown;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  query?: Record<string, number | string | undefined>;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(status: number, message: string, details: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken?: ApiClientOptions['getAccessToken'];
  private readonly onTokensRefreshed?: ApiClientOptions['onTokensRefreshed'];
  private readonly onUnauthorized?: ApiClientOptions['onUnauthorized'];
  private refreshToken: string | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_API_URL).replace(/\/$/, '');
    this.getAccessToken = options.getAccessToken;
    this.onTokensRefreshed = options.onTokensRefreshed;
    this.onUnauthorized = options.onUnauthorized;
  }

  setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken;
  }

  async login(email: string, password: string) {
    const tokens = await this.request<ApiTokens>('/auth/login', {
      body: { email, password },
      method: 'POST',
    });
    await this.applyTokens(tokens);
    return tokens;
  }

  async register(email: string, password: string) {
    const tokens = await this.request<ApiTokens>('/auth/register', {
      body: { email, password },
      method: 'POST',
    });
    await this.applyTokens(tokens);
    return tokens;
  }

  async me() {
    return this.request<ApiUser>('/users/me', { auth: true });
  }

  async updateMe(profile: Partial<ApiUser>) {
    return this.request<ApiUser>('/users/me', {
      auth: true,
      body: profile,
      method: 'PATCH',
    });
  }

  async searchFoodNutrition(params: {
    category?: string;
    limit?: number;
    page?: number;
    search?: string;
  } = {}) {
    return this.request<PaginatedFoodNutrition>('/food-nutrition', { query: params });
  }

  async getRecipes() {
    return this.request<Recipe[]>('/recipes', { auth: true });
  }

  async getDailyLog(date: string) {
    return this.request<DailyLog | null>('/daily-logs', {
      auth: true,
      query: { date },
    });
  }

  async getDailyLogs(startDate: string, endDate: string) {
    return this.request<DailyLog[]>('/daily-logs', {
      auth: true,
      query: { endDate, startDate },
    });
  }

  async upsertDailyLog(input: UpsertDailyLogInput) {
    return this.request<DailyLog>('/daily-logs', {
      auth: true,
      body: input,
      method: 'PUT',
    });
  }

  async getMealPlans(params?: string | { endDate?: string; startDate?: string }) {
    const query = typeof params === 'string' ? { date: params } : params;

    return this.request<MealPlan[]>('/meal-plans', {
      auth: true,
      query,
    });
  }

  async createMealPlan(input: CreateMealPlanInput) {
    return this.request<MealPlan>('/meal-plans', {
      auth: true,
      body: input,
      method: 'POST',
    });
  }

  async logout() {
    await this.request<{ message: string }>('/auth/logout', {
      auth: true,
      method: 'POST',
    });
    this.refreshToken = null;
  }

  private async request<T>(path: string, options: RequestOptions = {}, didRefresh = false): Promise<T> {
    const url = this.buildUrl(path, options.query);
    const headers = new Headers({ Accept: 'application/json' });

    if (options.body !== undefined) {
      headers.set('Content-Type', 'application/json');
    }

    if (options.auth) {
      const accessToken = await this.getAccessToken?.();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    const response = await fetch(url, {
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers,
      method: options.method ?? 'GET',
    });

    if (response.status === 401 && options.auth && this.refreshToken && !didRefresh) {
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        return this.request<T>(path, options, true);
      }
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const payload = await parseJson(response);

    if (!response.ok) {
      if (response.status === 401) {
        await this.onUnauthorized?.();
      }
      throw new ApiError(response.status, getErrorMessage(payload), payload);
    }

    return payload as T;
  }

  private buildUrl(path: string, query?: RequestOptions['query']) {
    const url = new URL(`${this.baseUrl}${path}`);

    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  private async refreshTokens() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const tokens = await this.request<ApiTokens>('/auth/refresh', {
        body: { refreshToken: this.refreshToken },
        method: 'POST',
      });
      await this.applyTokens(tokens);
      return true;
    } catch {
      this.refreshToken = null;
      await this.onUnauthorized?.();
      return false;
    }
  }

  private async applyTokens(tokens: ApiTokens) {
    this.refreshToken = tokens.refreshToken;
    await this.onTokensRefreshed?.(tokens);
  }
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text) as unknown;
}

function getErrorMessage(payload: unknown) {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = (payload as { message: unknown }).message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }
  return 'Request failed';
}

export const apiClient = new ApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
});
