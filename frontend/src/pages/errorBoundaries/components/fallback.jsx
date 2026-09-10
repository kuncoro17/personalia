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
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-2xl font-bold text-slate-900">Oops!!</h2>
          <img
            src="/assets/images/somethingWrong.png"
            className="w-56 object-contain"
          />
          <p className="text-center font-semibold text-slate-600">
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
