from src.constants.rectify_status import RECTIFYING


def create_hazard_ticket_dto(**overrides):
    row = {
        "id": 1,
        "result_id": 1,
        "severity": "MEDIUM",
        "owner_id": 1,
        "owner_name": "",
        "deadline": "",
        "rectify_note": "",
        "rectified_at": "",
        "closed_at": "",
        "rectify_status": RECTIFYING,
    }
    row.update(overrides)
    return row


def build_hazard_ticket_response(ticket: dict, state: dict, device: dict | None,
                                 repeat: dict | None) -> dict:
    """列表/详情统一响应构造器：派生状态、期限、重复隐患在这里拼装。

    注意：ticket 原始字段在前，state 的派生字段在后——复验结论必须覆盖建单快照。
    """
    return {
        **ticket,
        "device_id": device["id"] if device else None,
        "device_code": device["device_code"] if device else "",
        "location_desc": device["location_desc"] if device else "",
        "rectify_status": state["rectify_status"],
        "effective_deadline": state["effective_deadline"],
        "overdue": state["overdue"],
        "closed_at": state["closed_at"],
        "latest_verification": state["latest_verification"],
        "verifications": state["verifications"],
        "repeat_hazard": bool(repeat),
        "repeat_detail": repeat or None,
    }
