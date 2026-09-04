export const onDelete = (queryClient, index, field, key) => {
  queryClient.setQueryData([key], (oldData) => {
    const target = oldData?.data?.[field];

    if (!Array.isArray(target)) return oldData;

    return {
      ...oldData,
      data: {
        ...oldData.data,
        [field]: target.filter((_, i) => i !== index),
      },
    };
  });
};

export const onAddNew = (value, queryClient, field, key) => {
  try {
    queryClient.setQueryData([key], (oldRaw) => {
      if (!oldRaw) return oldRaw;

      return {
        ...oldRaw,
        data: {
          ...oldRaw.data,
          [field]: [...oldRaw.data[field], { ...value }],
        },
      };
    });
  } catch (err) {
    console.error(err);
  }
};
