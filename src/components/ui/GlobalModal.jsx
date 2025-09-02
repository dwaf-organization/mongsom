import { useModal } from '../../context/ModalContext';
import Modal from './Modal';

export default function GlobalModal() {
  const { modals, closeModal } = useModal();

  return (
    <>
      {modals.map(modal => (
        <Modal
          key={modal.id}
          title={modal.title}
          onClose={() => closeModal(modal.id)}
          showCloseButton={modal.showCloseButton}
          size={modal.size}
          className={modal.className}
        >
          {modal.content}
        </Modal>
      ))}
    </>
  );
}
