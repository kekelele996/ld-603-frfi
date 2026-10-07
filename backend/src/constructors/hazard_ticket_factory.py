def create_hazard_ticket_dto(**overrides):
    row = {
        "id": 1,
        "result_id": 1,
        "device_id": 1,
        "severity": "HIGH",
        "owner_id": 1,
        "deadline": "2026-09-15",
        "rectify_status": "PENDING",
        "rectify_note": "",
        "closed_at": "",
        "rechecks": [],
    }
    row.update(overrides)
    return row


def create_hazard_ticket_view(**overrides):
    """列表/详情响应对象：在原始单据上补充复验结论驱动的派生字段和重复隐患标记。"""
    row = {
        **create_hazard_ticket_dto(),
        "effective_status": "PENDING",
        "effective_deadline": "2026-09-15",
        "repeat_hazard": False,
        "repeat_rechecks": [],
        "repeat_detail": "",
    }
    row.update(overrides)
    return row
