import { useMemo, useState } from "react";

/** 隐患整改列表分页：配合顶部计数/筛选使用，rows 传筛选后的隐患单。 */
export function useHazardFlow<T>(rows: T[] = []) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const pageRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page]);
  return { page, setPage, pageSize, pageRows, total: rows.length };
}
