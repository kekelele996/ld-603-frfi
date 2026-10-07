"""整改状态：有复验后一切以复验结论为准。

- RECTIFYING       待整改：尚未提交复验
- PENDING_VERIFY   待复验：整改人已补录说明，等待维保商复验
- RE_RECTIFYING    整改不合格（复验未通过）：需重新整改
- CLOSED           已闭环：最近一次复验通过
"""

RECTIFYING = "RECTIFYING"
PENDING_VERIFY = "PENDING_VERIFY"
RE_RECTIFYING = "RE_RECTIFYING"
CLOSED = "CLOSED"
RECTIFY_STATUSES = (RECTIFYING, PENDING_VERIFY, RE_RECTIFYING, CLOSED)

RECTIFY_STATUS_TEXT = {
    RECTIFYING: "待整改",
    PENDING_VERIFY: "待复验",
    RE_RECTIFYING: "整改不合格",
    CLOSED: "已闭环",
}
