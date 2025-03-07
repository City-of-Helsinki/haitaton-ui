import React, { useRef } from 'react';
import { Modal, ModalProps } from '@chakra-ui/react';
import './InlineModal.scss';

interface Props extends ModalProps {
  children: React.ReactNode;
}

/**
 * Wrapper for chakra-ui Modal component that positions the modal according
 * to the normal document flow.
 */
export default function InlineModal({ children, ...props }: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} className="inline-modal-container">
      <Modal portalProps={{ containerRef }} {...props}>
        {children}
      </Modal>
    </div>
  );
}
