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
      case "flag_inactive":
        inputValue["tanggal_inactive"] = fieldValue
          ? moment().format("YYYY-MM-DD")
          : undefined;
        break;

      case "tanggal_inactive":
        inputValue["flag_inactive"] = true;
        break;

      case "divisi":
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

  const handleUpdate = (e, onClose) => {
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

      if (hasChange) onUpdate?.(changeValue, onClose);
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

      const selectedKeys = selectedOption
        ? new Set([selectedOption.key])
        : new Set();

      return (
        <Autocomplete
          id={fieldId}
          aria-labelledby={labelId}
          onSelectionChange={(keys) => {
            const option = options.find((entry) => entry.key === keys);

            if (item.master && typeof onSelect === "function") {
              onSelect(key, keys);
            }

            setFieldValue(key, option?.label ?? "");
          }}
          radius="sm"
          variant="bordered"
          defaultSelectedKey={selectedOption?.key}
          selectedKeys={selectedKeys}
          disabled={options.length === 0}
          items={options}
        >
          {(option) => (
            <AutocompleteItem
              key={option.key}
              textValue={option.label}
              className="font-Poppins text-primary"
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
            inputWrapper: "h-10 border-black border-1",
            input: "font-Poppins text-sm",
          }}
          showMonthAndYearPickers
          value={calendarDate ?? undefined}
          onChange={(date) => setFieldValue(key, date ? date.toString() : "")}
        />
      );
    }

    const getMaxLength = (fieldKey) => {
      const maxLengths = {
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
        onValueChange={(val) => setFieldValue(key, val)}
        placeholder={getPlaceholder(key)}
        maxLength={getMaxLength(key)}
        classNames={{
          inputWrapper: "h-10 border-black border-1",
          input: "font-Poppins text-sm",
        }}
        validate={(value) => {
          if (value.trim() !== "") {
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
      className="max-w-max min-h-max"
      backdrop="blur"
      onClose={handleClose}
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <Form
            className="flex flex-col items-left w-full"
            onSubmit={(e) => handleUpdate(e, onClose)}
          >
            <ModalHeader className="flex flex-col gap-1 items-center font-Poppins text-xl">
              {title}
            </ModalHeader>
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center w-full">
                <Spinner color="primary" size="md" />
              </div>
            ) : (
              <ModalBody className="grid flex-1 gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data.map((item, index) => {
                  if (item.title === "Id" || item.editable === false)
                    return null;

                  const fieldId = `modal-input-${item.properties}`;
                  const labelId = `modal-label-${item.properties}`;

                  return (
                    <div
                      key={`${item.properties}-${index}`}
                      className="flex flex-col gap-2 items-start flex-1"
                    >
                      <label
                        id={labelId}
                        htmlFor={fieldId}
                        className="font-Poppins font-normal opacity-50 text-sm"
                      >
                        {item.title}
                      </label>

                      {renderField(item, fieldId, labelId)}
                    </div>
                  );
                })}
              </ModalBody>
            )}
            <ModalFooter>
              <Button color="danger" variant="bordered" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" isLoading={loading}>
                Submit
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
