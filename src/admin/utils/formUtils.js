import { splitPhone } from './phoneUtils';

export function toFormState(userData, userCode) {
  if (!userData) {
    return {
      userCode: userCode ?? '',
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
    userCode: userCode ?? '',
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

export function toApiPayload(formData, includePassword = false) {
  const payload = {
    userCode: formData.userCode, // ← 폼 상태에서 온 값
    userId: formData.userId,
    name: formData.name,
    phone: [formData.phone1, formData.phone2, formData.phone3].join(''),
    email: formData.email,
    zipCode: formData.address.zipCode,
    address: formData.address.address,
    address2: formData.address.address2,
    password: formData.password,
  };

  if (includePassword && formData.password) {
    payload.password = formData.password;
  }

  return payload;
}
