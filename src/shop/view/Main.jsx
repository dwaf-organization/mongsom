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

export default function Main() {
  return (
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
  );
}
