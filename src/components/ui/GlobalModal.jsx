import { useModal } from '../../context/ModalContext';
import Modal from './Modal';

export default function GlobalModal() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen || !modalContent) return null;

  return <Modal onClose={closeModal}>{modalContent}</Modal>;
}
