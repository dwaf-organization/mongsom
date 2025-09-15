export default function InnerPaddingSectionWrapper({ children, className }) {
  return (
    <div
      className={`md:px-0 container mx-auto w-full py-10 max-w-[1000px] ${className}`}
    >
      {children}
    </div>
  );
}
