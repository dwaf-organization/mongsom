/**
 * 전화번호를 3개 부분으로 분리하는 함수
 * @param {string} phone - 전화번호 문자열
 * @returns {Object} { p1, p2, p3 } - 각각 3자리, 4자리, 4자리
 */
export function splitPhone(phone) {
  const only = String(phone || '').replace(/\D/g, '');
  if (only.length === 11)
    return { p1: only.slice(0, 3), p2: only.slice(3, 7), p3: only.slice(7) };
  if (only.length === 10)
    return { p1: only.slice(0, 3), p2: only.slice(3, 6), p3: only.slice(6) };
  return { p1: only.slice(0, 3), p2: only.slice(3, 7), p3: only.slice(7, 11) };
}

/**
 * 전화번호 배열을 문자열로 합치는 함수
 * @param {Array} phoneArray - [phone1, phone2, phone3] 배열
 * @returns {string} - 합쳐진 전화번호 문자열
 */
export function joinPhone(phoneArray) {
  return phoneArray.join('');
}

/**
 * 숫자만 추출하는 함수
 * @param {string} value - 입력값
 * @returns {string} - 숫자만 추출된 문자열
 */
export function onlyDigits(value) {
  return value.replace(/\D/g, '');
}
