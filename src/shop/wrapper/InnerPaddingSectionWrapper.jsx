export default function InnerPaddingSectionWrapper({ children, className }) {
  return (
    <div
      className={`xl:px-0 container mx-auto w-full py-10 max-w-[1000px] px-4 ${className}`}
    >
      {children}
    </div>
  );
}
