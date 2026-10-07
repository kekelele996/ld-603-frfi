import { useMemo, useState } from "react";
import type { HazardTicket } from "../types/HazardTicket";
import { summarizeHazards } from "../utils/hazardView";

/**
 * 隐患整改流程：
 * - 列表顶部计数按复验后的整改状态统计（待整改/整改中/复验未过/已关闭 + 重复隐患）
 * - 简单分页，和 usePagination 保持一致的页容量
 */
export function useHazardFlow(rows: HazardTicket[] = []) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const summary = useMemo(() => summarizeHazards(rows), [rows]);
  const pageRows = useMemo(
    () => rows.slice((page - 1) * pageSize, page * pageSize),
    [rows, page]
  );
  return { page, setPage, pageSize, pageRows, total: rows.length, summary };
}
