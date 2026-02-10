import { addToast } from "@heroui/toast";

import { useToastSlice } from "../stores/useToast";

export default function useToast(errMessage, propToast = {}) {
  if (!errMessage) return;

  const { message, setMessage, deleteMessage } = useToastSlice.getState();

  if (!message.includes(errMessage)) {
    setMessage(errMessage);
    addToast({
      ...propToast,
      onClose: () => deleteMessage(errMessage),
    });
  }
}
