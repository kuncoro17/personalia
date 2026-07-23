const unwrapRecord = (record) => record?.dataValues ?? record ?? {};

export const normalizeJoinTodayResponse = (payload) => {
  const result = payload?.data ?? payload;
  const rows = Array.isArray(result?.data)
    ? result.data
    : Array.isArray(result)
      ? result
      : [];

  return rows.map(unwrapRecord).filter((row) => row.id_karyawan);
};

export const getNewEmployeeStatus = (employee) =>
  employee?.stat_karyawan_gp ?? employee?.status_karyawan ?? "-";
