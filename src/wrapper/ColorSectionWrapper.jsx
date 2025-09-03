import { forwardRef } from 'react';

const ColorSectionWrapper = forwardRef(({ children, className = '' }, ref) => {
  return (
    <section
      ref={ref}
      className={`bg-primary-100 py-20 px-6 md:px-0 ${className}`}
    >
      {children}
    </section>
  );
});

ColorSectionWrapper.displayName = 'ColorSectionWrapper';

export default ColorSectionWrapper;
