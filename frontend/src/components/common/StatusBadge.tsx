import { RectifyStatus } from "../../constants/RectifyStatus";
import { formatRectifyStatus } from "../../utils/formatters";

/** 状态徽标：整改状态走复验后的中文文案，其它状态回退为原枚举文案 */
export function StatusBadge({ value = "" }: { value?: string }) {
  const key = String(value).toLowerCase().replace(/_/g, "-");
  const isRectify = (RectifyStatus as readonly string[]).includes(value);
  const label = isRectify ? formatRectifyStatus(value) : String(value || "—").replace(/_/g, " ");
  return <span className={"badge badge-" + key}>{label}</span>;
}
