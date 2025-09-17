import { splitPhone } from './phoneUtils';

/**
 * 사용자 데이터를 폼 상태로 변환하는 함수
 * @param {Object} userData - 사용자 데이터 객체
 * @returns {Object} - 폼 상태 객체
 */
export function toFormState(userData) {
  if (!userData) {
    return {
      userId: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone1: '',
      phone2: '',
      phone3: '',
      email: '',
      address: { zipCode: '', address: '', address2: '' },
    };
  }

  const { p1, p2, p3 } = splitPhone(userData.phone);

  return {
    userId: userData.userId ?? '',
    password: '',
    confirmPassword: '',
    name: userData.name ?? '',
    phone1: p1,
    phone2: p2,
    phone3: p3,
    email: userData.email ?? '',
    address: {
      zipCode: userData.zipCode ?? '',
      address: userData.address ?? '',
      address2: userData.address2 ?? '',
    },
  };
}

/**
 * 폼 데이터를 API 페이로드로 변환하는 함수
 * @param {Object} formData - 폼 데이터
 * @param {boolean} includePassword - 비밀번호 포함 여부
 * @returns {Object} - API 페이로드 객체
 */
export function toApiPayload(formData, includePassword = false) {
  const payload = {
    userId: formData.userId,
    name: formData.name,
    phone: [formData.phone1, formData.phone2, formData.phone3].join(''),
    email: formData.email,
    zipCode: formData.address.zipCode,
    address: formData.address.address,
    address2: formData.address.address2,
  };

  if (includePassword && formData.password) {
    payload.password = formData.password;
  }

  return payload;
}
