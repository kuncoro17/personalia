import { Button, Modal, ModalContent } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { canAutoRefresh, claimAutoRefresh } from "../../../utils/errorRefresh";

export function DefaultFallback() {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let storage;

    try {
      storage = window.sessionStorage;
    } catch {
      return undefined;
    }

    if (!canAutoRefresh(storage)) return undefined;

    setRefreshing(true);
    const timer = window.setTimeout(() => {
      // Claim only when the timer fires so StrictMode cleanup cannot consume it.
      if (claimAutoRefresh(storage)) {
        window.location.reload();
      } else {
        setRefreshing(false);
      }
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  const modal = (
    <Modal
      hideCloseButton
      isKeyboardDismissDisabled
      isOpen
      backdrop="blur"
      className="max-w-lg h-96"
      classNames={{
        wrapper: "overflow-hidden",
        closeButton: "hidden",
      }}
      isDismissable={false}
      motionProps={{
        variants: {
          enter: { y: 0, transition: { duration: 0.25 } },
          exit: { y: 400, transition: { duration: 0.15 } },
        },
      }}
      placement="center"
    >
      <ModalContent>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-2xl font-bold text-slate-900">Oops!!</h2>
          <img
            alt="Terjadi kesalahan"
            className="w-56 object-contain"
            src="/assets/images/somethingWrong.png"
          />
          <p className="text-center font-semibold text-slate-600">
            {refreshing
              ? "Terjadi kesalahan. Halaman akan dimuat ulang otomatis..."
              : "Masih terjadi kesalahan. Silakan muat ulang halaman."}
          </p>
          {!refreshing && (
            <Button color="primary" onPress={() => window.location.reload()}>
              Muat Ulang
            </Button>
          )}
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
