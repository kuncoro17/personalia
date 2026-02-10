import { Modal, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export function DefaultFallback() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => onOpen(), []);

  const modal = (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      onClose={() => {
        onOpenChange(false);
        window.location.href = `/${user?.role.toLowerCase()}`;
      }}
      onOpenChange={onOpenChange}
      className="max-w-lg h-96"
      classNames={{
        wrapper: "overflow-hidden",
        closeButton: "hidden",
      }}
      motionProps={{
        variants: {
          enter: { y: 0, transition: { duration: 0.25 } },
          exit: { y: 400, transition: { duration: 0.15 } },
        },
      }}
    >
      <ModalContent>
        <div className="p-8 flex flex-col items-center gap-4 flex-1 h-full justify-center">
          <h2 className="font-bold text-2xl text-primary">Oops!!</h2>
          <img
            src="/assets/images/somethingWrong.png"
            className="w-56 object-contain"
          />
          <p className="text-center font-semibold text-primary">
            Something went wrong - please try again!
          </p>
        </div>
      </ModalContent>
    </Modal>
  );

  const portalTarget = useMemo(() => {
    if (typeof document === "undefined") return null;

    let container = document.getElementById("error-modal-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "error-modal-root";
      document.body.appendChild(container);
    }

    return container;
  }, []);

  if (!portalTarget) {
    return null;
  }

  return createPortal(modal, portalTarget);
}
