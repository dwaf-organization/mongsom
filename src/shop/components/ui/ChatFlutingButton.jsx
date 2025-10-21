// ChatButtonQuick.jsx
import ChatIcon from '../../asset/icons/ChatIcon';
import { useEffect, useRef, useState } from 'react';

const JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;
const CHANNEL_PUBLIC_ID = process.env.REACT_APP_KAKAO_CHANNEL_ID;
const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';

export default function ChatFlutingButton() {
  const [ready, setReady] = useState(Boolean(window.Kakao?.isInitialized?.()));
  const loadingRef = useRef(false);

  useEffect(() => {
    if (ready || !JS_KEY || !CHANNEL_PUBLIC_ID) return;
    if (window.Kakao?.isInitialized?.()) {
      setReady(true);
      return;
    }
    if (loadingRef.current) return;
    loadingRef.current = true;

    const s = document.createElement('script');
    s.src = KAKAO_SDK_URL;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      try {
        if (!window.Kakao.isInitialized()) window.Kakao.init(JS_KEY);
        setReady(true);
      } catch (e) {
        console.error('[Kakao init 실패]', e);
        setReady(false);
      }
    };
    s.onerror = e => {
      console.error('[Kakao SDK 로드 실패]', e);
      setReady(false);
    };
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, [ready]);

  const openChat = () => {
    try {
      if (ready && window.Kakao?.Channel) {
        window.Kakao.Channel({ channelPublicId: CHANNEL_PUBLIC_ID });
        return;
      }
    } catch (e) {
      console.error('[Channel.chat 실패]', e);
    }
    const id = CHANNEL_PUBLIC_ID?.startsWith('_')
      ? CHANNEL_PUBLIC_ID
      : `_${CHANNEL_PUBLIC_ID}`;
    window.open(`https://pf.kakao.com/${id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type='button'
      onClick={openChat}
      className='fixed bottom-10 right-10 z-50 rounded-full bg-primary-200 text-black
                w-12 h-12 shadow-lg font-semibold'
    >
      <ChatIcon className='w-6 h-6 inline-block align-middle' />
    </button>
  );
}
