export const normalizeApiList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

export const unwrapApiRecord = (record) => record?.dataValues ?? record ?? {};
