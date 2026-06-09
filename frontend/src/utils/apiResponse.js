export const extractPaginatedList = (response) => {
  if (!response) {
    return { data: [], pagination: { totalPages: 1 } };
  }

  if (Array.isArray(response)) {
    return { data: response, pagination: { totalPages: 1 } };
  }

  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      pagination: response.pagination || { totalPages: 1 },
    };
  }

  if (response.data?.data && Array.isArray(response.data.data)) {
    return {
      data: response.data.data,
      pagination: response.data.pagination || { totalPages: 1 },
    };
  }

  return { data: [], pagination: { totalPages: 1 } };
};

export const extractListData = (response) =>
  extractPaginatedList(response).data;

/** Use when loading full lists for dropdowns or client-side filters */
export const LIST_FETCH_ALL_PARAMS = { page: 1, limit: 1000 };
