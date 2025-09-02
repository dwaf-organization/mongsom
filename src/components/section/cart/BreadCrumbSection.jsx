import { RightChevron } from '../../../asset/icons';

export default function BreadCrumbSection({
  currentStep = 'cart',
  className = '',
}) {
  const steps = [
    { key: 'cart', label: '장바구니' },
    { key: 'order', label: '주문 / 결제' },
    { key: 'complete', label: '주문 완료' },
  ];

  const getStepStyles = stepKey => {
    const isActive = stepKey === currentStep;
    const isCompleted =
      steps.findIndex(step => step.key === currentStep) >
      steps.findIndex(step => step.key === stepKey);

    if (isActive) {
      return 'font-semibold text-black';
    } else if (isCompleted) {
      return 'font-semibold text-gray-600';
    } else {
      return 'text-gray-600';
    }
  };

  return (
    <ul
      className={`flex items-center gap-4 justify-center font-pretendard text-xl pt-5 border-b-2 border-black-100 pb-10 ${className}`}
    >
      {steps.map((step, index) => (
        <div key={step.key} className='flex items-center'>
          <li>
            <p className={getStepStyles(step.key)}>{step.label}</p>
          </li>
          {index < steps.length - 1 && <RightChevron />}
        </div>
      ))}
    </ul>
  );
}
