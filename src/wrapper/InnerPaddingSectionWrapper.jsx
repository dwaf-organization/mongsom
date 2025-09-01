export default function InnerPaddingSectionWrapper({ children }) {
  return (
    <div className=' md:px-0 container mx-auto py-20 max-w-[1280px]'>
      {children}
    </div>
  );
}
