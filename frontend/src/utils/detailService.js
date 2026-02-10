export const onDelete = (queryClient, index, field, key) => {
  queryClient.setQueryData([key], (oldData) => ({
    ...oldData,
    data: {
      ...oldData.data,
      [field]: oldData.data[field].filter((_, i) => i !== index),
    },
  }));
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
