import { motion } from 'framer-motion';

import Mainwrapper from '../wrapper/Mainwrapper';
import {
  HeroSection,
  TopProductSection,
  BestReviewSection,
  BrandStorySection,
} from '../components/section/main';
import ChatFlutingButton from '../components/ui/ChatFlutingButton';
import MoblieTopProduct from '../components/section/main/MobileTopProduct';
import Meta from '../../components/seo/Meta';
import { SITE_URL } from '../../constants/seo';

export default function Main() {
  return (
    <>
      <Meta
        title='몽솜 | 특별한 날, 행복을 전해줄 선물'
        description='답례품·대량구매 전문 쇼핑몰 몽솜. 상황별 맞춤 선물, 빠른 상담.'
        canonical={`${SITE_URL}/`}
      />
      <Mainwrapper>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className='w-full'
        >
          <HeroSection />
          <TopProductSection />
          <MoblieTopProduct />
          <BestReviewSection />
          <BrandStorySection />
          <ChatFlutingButton />
        </motion.div>
      </Mainwrapper>
    </>
  );
}
