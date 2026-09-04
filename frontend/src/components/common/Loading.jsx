import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className={`w-full flex items-center justify-center min-h-20`}>
      <Spinner size="md" color="primary" />
    </div>
  );
}
