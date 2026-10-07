"""写操作审计日志（巡检提交、隐患派单、复验关闭等）。

与中间件分开：中间件只记录请求骨架，业务字段在 service 落审计。
"""

from src.seed import seed
from src.constants.log_templates import LOG_MESSAGE_TEMPLATES


def record(action: str, target_type: str, target_id, actor="系统账号", **fields):
    entry = {
        "action": action,
        "target_type": target_type,
        "target_id": str(target_id),
        "actor": actor,
        "message": LOG_MESSAGE_TEMPLATES.get(action, action).format(
            target_id=target_id, actor=actor, **fields
        ),
    }
    seed["auditLog"].append(entry)
    print("audit-log", entry["message"])
    return entry
