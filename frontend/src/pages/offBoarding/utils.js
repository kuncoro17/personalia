const unwrapRecord = (record) => record?.dataValues ?? record ?? {};

export const normalizeOffboardingResponse = (payload) => {
  const result = payload?.data ?? payload;
  const rows = Array.isArray(result?.data) ? result.data : [];

  return {
    total: Number(result?.total ?? rows.length) || 0,
    date: String(result?.date ?? ""),
    employees: rows.map(unwrapRecord).filter((row) => row.id_karyawan),
  };
};

export const formatOffboardingDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""))) return "Hari ini";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${value}T00:00:00+07:00`));
};
