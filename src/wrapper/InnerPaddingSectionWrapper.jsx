export default function InnerPaddingSectionWrapper({ children }) {
  return (
    <div className=' md:px-0 container mx-auto w-full py-20 max-w-[1000px]'>
      {children}
    </div>
  );
}
