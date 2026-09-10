import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildInitialValue,
  toCalendarDate,
  formatNPWP,
} from "../../../utils/format";
import { PROPFORM } from "../../../constants/ui";
import moment from "moment";

export default function Modals({
  data,
  title,
  isOpen,
  onOpenChange,
  onUpdate,
  isLoading,
  onSelect,
  allowSubmitWithoutChange = false,
}) {
  const initialValue = useMemo(() => buildInitialValue(data), [data]);

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const previousInitialValue = useRef(initialValue);

  useEffect(() => {
    const prevInitialValue = previousInitialValue.current;
    const hasInitialValueChanged =
      !prevInitialValue ||
      Object.keys(prevInitialValue).length !==
        Object.keys(initialValue).length ||
      Object.keys(initialValue).some(
        (key) => prevInitialValue[key] !== initialValue[key],
      );

    previousInitialValue.current = initialValue;

    if (hasInitialValueChanged) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const setFieldValue = (key, fieldValue) => {
    let inputValue = { [key]: fieldValue };

    switch (key) {
      case "nik":
        inputValue["nik"] = String(fieldValue ?? "")
          .replace(/\D+/g, "")
          .slice(0, 16);
        break;

      case "flag_inactive":
        inputValue["tanggal_inactive"] = fieldValue
          ? moment().format("YYYY-MM-DD")
          : null;
        break;

      case "tanggal_inactive":
        inputValue["flag_inactive"] = true;
        break;

      case "divisi":
        inputValue["bagian"] = undefined;
        inputValue["seksi"] = undefined;
        break;

      case "bagian":
        inputValue["seksi"] = undefined;
        break;

      case "npwp":
        inputValue["npwp"] = formatNPWP(fieldValue);
        break;

      default:
        break;
    }

    setValue((prev) => ({
      ...(prev ?? {}),
      ...inputValue,
    }));
  };

  const handleUpdate = async (e, onClose) => {
    try {
      setLoading(true);
      e.preventDefault();

      const hasChange = Object.keys(value).some(
        (key) => value[key] !== initialValue[key],
      );
      const changeValue = Object.keys(value).reduce((acc, key) => {
        if (value[key] !== initialValue[key]) acc[key] = value[key];
        return acc;
      }, {});

      if (hasChange || allowSubmitWithoutChange) {
        await onUpdate?.(changeValue, onClose);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValue(initialValue);
  };

  const renderField = (item, fieldId, labelId) => {
    const key = item.properties;
    const currentValue = value[key];

    if (item.form === "file") {
      const selectedFileName =
        currentValue instanceof File
          ? currentValue.name
          : typeof currentValue === "string" && currentValue !== ""
            ? "File saat ini sudah tersimpan"
            : "Belum ada file dipilih";

      return (
        <div className="flex flex-col gap-2 w-full">
          <input
            id={fieldId}
            name={key}
            aria-labelledby={labelId}
            type="file"
            accept={item.accept || "image/*"}
            className="block w-full cursor-pointer rounded-md border border-slate-300 bg-white text-sm text-slate-700 shadow-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            onChange={(event) =>
              setFieldValue(key, event.target.files?.[0] || "")
            }
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedFileName}
          </p>
        </div>
      );
    }

    if (item.form === "select") {
      const options = (item?.listSelect || []).map((entry) => {
        if (typeof entry === "string") {
          const normalized = entry.trim();
          return { key: normalized, label: normalized };
        }

        const label =
          entry?.name ??
          entry?.label ??
          entry?.nama ??
          (entry?.id !== undefined && entry?.id !== null
            ? String(entry.id)
            : "");
        const rawKey =
          entry?.id ??
          entry?.key ??
          entry?.value ??
          entry?.kode ??
          entry?.slug ??
          label;

        return {
          key: rawKey !== undefined && rawKey !== null ? String(rawKey) : label,
          label,
        };
      });

      let resolvedValue =
        currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== ""
          ? (currentValue?.nama ?? currentValue)
          : (item.value ?? "");

      if (typeof resolvedValue === "string") {
        resolvedValue = resolvedValue.trim();
      }
      if (resolvedValue === "-" || resolvedValue === null) {
        resolvedValue = "";
      }
      const resolvedKey =
        resolvedValue === undefined ||
        resolvedValue === null ||
        resolvedValue === ""
          ? ""
          : (resolvedValue?.id ?? resolvedValue);

      const selectedOption =
        options.find((option) => option.key === resolvedKey) ??
        options.find((option) => option.label === resolvedKey);

      return (
        <Autocomplete
          id={fieldId}
          aria-labelledby={labelId}
          onSelectionChange={(keys) => {
            const option = options.find((entry) => entry.key === keys);

            if (item.master && typeof onSelect === "function") {
              onSelect(key, keys);
            }

            setFieldValue(
              key,
              item.valueMode === "key"
                ? (option?.key ?? "")
                : (option?.label ?? ""),
            );
          }}
          radius="sm"
          variant="bordered"
          defaultSelectedKey={selectedOption?.key}
          selectedKey={selectedOption?.key ?? null}
          disabled={options.length === 0}
          items={options}
        >
          {(option) => (
            <AutocompleteItem
              key={option.key}
              textValue={option.label}
              className="text-slate-700 dark:text-slate-200"
            >
              {option.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
      );
    }

    if (item.form === "checkbox") {
      return (
        <Checkbox
          id={fieldId}
          aria-labelledby={labelId}
          isSelected={Boolean(currentValue)}
          onValueChange={(isSelected) => setFieldValue(key, isSelected)}
          radius="sm"
        />
      );
    }

    if (item.form === "date") {
      const calendarDate = toCalendarDate(currentValue);

      return (
        <DatePicker
          id={fieldId}
          aria-labelledby={labelId}
          variant="bordered"
          radius="sm"
          classNames={{
            inputWrapper: "h-10 border-slate-300 border-1",
            input: "text-sm",
          }}
          showMonthAndYearPickers
          value={calendarDate ?? undefined}
          onChange={(date) => setFieldValue(key, date ? date.toString() : "")}
        />
      );
    }

    const getMaxLength = (fieldKey) => {
      const maxLengths = {
        nik: 16,
        no_ktp: 16,
        npwp: 20,
        nomor_bpjs_kesehatan: 13,
        nomor_bpjs_ketenagakerjaan: 11,
        nomor_bpjs_jaminan_pensiun: 11,
        no_bpjs_kesehatan: 13,
        no_bpjs_ketenagakerjaan: 11,
        no_bpjs_danpes: 15,
      };
      return maxLengths[fieldKey];
    };

    const getPlaceholder = (fieldKey) => {
      const placeholders = {
        npwp: "XX.XXX.XXX.X-XXX.XXX",
        nomor_bpjs_kesehatan: "13 digit",
        nomor_bpjs_ketenagakerjaan: "11 digit",
        nomor_bpjs_jaminan_pensiun: "11 digit",
      };
      return placeholders[fieldKey];
    };

    return (
      <Input
        {...PROPFORM}
        id={fieldId}
        name={key}
        aria-labelledby={labelId}
        value={
          currentValue === undefined || currentValue === null
            ? ""
            : String(currentValue)
        }
        onValueChange={(val) => {
          if (key === "nik" || key === "no_ktp") {
            const digitsOnly = String(val ?? "")
              .replace(/\\D+/g, "")
              .slice(0, 16);
            setFieldValue(key, digitsOnly);
            return;
          }
          setFieldValue(key, val);
        }}
        inputMode={key === "nik" || key === "no_ktp" ? "numeric" : undefined}
        pattern={key === "nik" || key === "no_ktp" ? "[0-9]*" : undefined}
        placeholder={getPlaceholder(key)}
        maxLength={getMaxLength(key)}
        classNames={{
          inputWrapper: "h-10 border-slate-300 border-1",
          input: "text-sm",
        }}
        validate={(value) => {
          if (value.trim() !== "") {
            if (key === "nik" && !/^[0-9]{7,16}$/.test(value.trim())) {
              return "NIK harus berupa angka minimal 7 digit!";
            }

            if (key === "no_ktp" && !/^[0-9]{16}$/.test(value.trim())) {
              return "No KTP harus berupa angka 16 digit!";
            }

            if (!/^\d+$/.test(value.trim()) && item.form === "number") {
              return "Harus berupa angka!";
            }

            if (item.form === "float" && isNaN(parseFloat(value.trim()))) {
              return "Harus berupa angka desimal!";
            }

            if (
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) &&
              item.form === "email"
            ) {
              return "Harus berupa email!";
            }
          }
        }}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-[calc(100vw-2rem)] min-h-max max-w-6xl"
      backdrop="blur"
      onClose={handleClose}
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <Form
            className="flex w-full flex-col items-start"
            onSubmit={(e) => handleUpdate(e, onClose)}
          >
            <ModalHeader className="flex w-full flex-col items-start gap-1 border-b border-slate-200 text-lg font-semibold text-slate-950 dark:border-slate-800 dark:text-slate-100">
              {title}
            </ModalHeader>
            {isLoading ? (
              <div className="flex w-full flex-1 items-center justify-center p-8">
                <Spinner color="primary" size="md" />
              </div>
            ) : (
              <ModalBody className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data.map((item, index) => {
                  if (item.title === "Id" || item.editable === false)
                    return null;

                  const fieldId = `modal-input-${item.properties}`;
                  const labelId = `modal-label-${item.properties}`;

                  return (
                    <div
                      key={`${item.properties}-${index}`}
                      className="flex flex-1 flex-col items-start gap-2"
                    >
                      <label
                        id={labelId}
                        htmlFor={fieldId}
                        className="text-sm font-medium text-slate-500 dark:text-slate-400"
                      >
                        {item.title}
                        {item.required ? (
                          <span className="ml-1 text-danger">*</span>
                        ) : null}
                      </label>

                      {renderField(item, fieldId, labelId)}
                    </div>
                  );
                })}
              </ModalBody>
            )}
            <ModalFooter className="w-full border-t border-slate-200 dark:border-slate-800">
              <Button
                className="personalia-action-button personalia-action-button-light"
                color="danger"
                variant="bordered"
                onPress={onClose}
              >
                Tutup
              </Button>
              <Button
                className="personalia-action-button personalia-action-button-primary"
                color="primary"
                type="submit"
                isLoading={loading}
              >
                Simpan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
