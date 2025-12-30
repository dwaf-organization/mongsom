const BASE_URL =
  (typeof process !== 'undefined' && process.env?.REACT_APP_BASE_API_URL) ||
  'http://localhost:8000/';
// 'https://api.mongsom.co.kr/';'

/**
 * @typedef {Object} CommonResponse
 * @property {number} code
 * @property {string} httpStatus
 * @property {string} message
 * @property {any} result
 */

/**
 * @typedef {RequestInit & {
 *   isMultipart?: boolean;
 *   requireAuth?: boolean;
 *   tokenGetter?: () => ({ accessToken?: string, memberUuid?: string } | null);
 * }} RequestOptions
 */

function defaultTokenGetter() {
  try {
    const raw = localStorage.getItem('userCode');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed?.accessToken || null,
      memberUuid: parsed?.memberUuid || null,
    };
  } catch {
    return null;
  }
}

async function fetchInstance(url, options = {}) {
  const {
    isMultipart = false,
    requireAuth = false,
    tokenGetter = defaultTokenGetter,
    ...rest
  } = options;

  try {
    const headers = new Headers(rest.headers || {});

    // 인증 헤더 구성
    if (requireAuth) {
      const creds = tokenGetter();
      const accessToken = creds?.accessToken;
      const memberUuid = creds?.memberUuid;

      if (!accessToken || !memberUuid) {
        throw new Error('인증이 필요합니다');
      }
      headers.set('Authorization', `Bearer ${accessToken}`);
      headers.set('X-Member-UUID', memberUuid);
    }

    // 바디/컨텐트 타입 처리
    let body = rest.body;

    if (isMultipart || body instanceof FormData) {
      // 브라우저가 boundary 자동 설정하므로 직접 안 건드림
      // headers.delete('Content-Type') // Headers 객체에 없을 수도 있으니 안전하게:
      if (headers.has('Content-Type')) headers.delete('Content-Type');
    } else {
      headers.set('Content-Type', 'application/json');
      if (body && typeof body === 'object') {
        body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      ...rest,
      headers,
      body,
      // credentials: 'include', // httpOnly 쿠키 전략이면 주석 해제
      // cache: 'no-store', // 필요 시 캐시 전략 지정
    });

    const contentType = response.headers.get('content-type') || '';
    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📡 Content-Type:', contentType);
    if (!contentType.includes('application/json')) {
      const text = await response.text().catch(() => '');
      console.error('Unexpected content type:', contentType);
      console.error('Response body:', text);
      throw new Error('Invalid response format');
    }

    /** @type {CommonResponse} */
    const result = await response.json();

    if (!response.ok) {
      console.error('API Error:', result);
    }

    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    /** @type {CommonResponse} */
    return {
      httpStatus: 'INTERNAL_SERVER_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 500,
      result: null,
    };
  }
}

export const fetchData = {
  /**
   * @param {string} url
   * @param {Omit<RequestOptions, 'body'|'method'>} options
   * @returns {Promise<CommonResponse>}
   */
  get: (url, options = {}) => fetchInstance(url, { method: 'GET', ...options }),

  /**
   * @param {string} url
   * @param {Omit<RequestOptions, 'method'>} options
   * @returns {Promise[CommonResponse]}
   */
  post: (url, options = {}) =>
    fetchInstance(url, { method: 'POST', ...options }),

  patch: (url, options = {}) =>
    fetchInstance(url, { method: 'PATCH', ...options }),

  put: (url, options = {}) => fetchInstance(url, { method: 'PUT', ...options }),

  delete: (url, options = {}) =>
    fetchInstance(url, { method: 'DELETE', ...options }),
};
