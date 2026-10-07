# 隐患单整改状态。建单时为 PENDING；整改人补录整改说明后为 RECTIFYING；
# 复验不通过为 RECHECK_FAILED；复验通过为 CLOSED。
RectifyStatus = ["PENDING", "RECTIFYING", "RECHECK_FAILED", "CLOSED"]

RectifyStatusText = {
    "PENDING": "待整改",
    "RECTIFYING": "整改中",
    "RECHECK_FAILED": "复验未过",
    "CLOSED": "已关闭",
}
