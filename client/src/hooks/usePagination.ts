import { useState } from "react";
import { Pagination } from "../types/pagination.types";

export const usePagination = (initialLimit = 10) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const getPaginationState = (total: number): Pagination => {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      from: (page - 1) * limit + 1,
      to: Math.min(page * limit, total),
    };
  };

  return { page, setPage, limit, setLimit, getPaginationState };
};
