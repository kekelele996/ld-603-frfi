"""隐患单领域推导：复验结论是唯一事实来源。

存好复验/整改说明后，整改状态、整改期限、闭环时间、列表顶部计数、
重复隐患标记全部由本模块从复验记录推导，页面和 service 不得散写规则。
"""

from src.constants.rectify_status import (
    CLOSED,
    PENDING_VERIFY,
    RE_RECTIFYING,
    RECTIFYING,
)
from src.constants.verification_result import FAIL, PASS


def _sorted_verifications(verifications: list[dict]) -> list[dict]:
    return sorted(verifications, key=lambda item: item["verified_at"])


def derive_ticket_state(ticket: dict, ticket_verifications: list[dict], today: str) -> dict:
    """返回隐患单的派生字段（不改原对象）。"""
    ordered = _sorted_verifications(ticket_verifications)
    latest = ordered[-1] if ordered else None

    if latest is None:
        rectify_status = PENDING_VERIFY if ticket.get("rectify_note") else RECTIFYING
        effective_deadline = ticket["deadline"]
        closed_at = ticket.get("closed_at", "")
    elif latest["result"] == PASS:
        rectify_status = CLOSED
        effective_deadline = ticket["deadline"]
        closed_at = latest["verified_at"]
    else:
        rectify_status = RE_RECTIFYING
        # 复验不过且给出了新期限时，以新期限为准
        effective_deadline = latest.get("new_deadline") or ticket["deadline"]
        closed_at = ""

    return {
        "rectify_status": rectify_status,
        "effective_deadline": effective_deadline,
        "closed_at": closed_at,
        "latest_verification": latest,
        "verifications": ordered,
        "overdue": bool(rectify_status != CLOSED and effective_deadline and effective_deadline < today),
    }


def derive_repeat_hazards(tickets: list[dict], verifications: list[dict],
                          results: list[dict]) -> dict[int, dict]:
    """同一台设备最近两次复验都未通过 → 关联单标为重复隐患。

    返回 {ticket_id: 重复隐患说明}，说明里写明是哪两次复验。
    """
    result_device = {row["id"]: row["device_id"] for row in results}
    ticket_device = {t["id"]: result_device.get(t["result_id"]) for t in tickets}

    ordered = _sorted_verifications(verifications)
    failed = [v for v in ordered if v["result"] == FAIL]
    if len(failed) < 2:
        return {}

    first, second = failed[-2], failed[-1]
    device_id = ticket_device.get(second["ticket_id"])
    if not device_id or ticket_device.get(first["ticket_id"]) != device_id:
        return {}

    detail = {
        "device_id": device_id,
        "first_ticket_id": first["ticket_id"],
        "first_verified_at": first["verified_at"],
        "first_inspector": first["inspector"],
        "second_ticket_id": second["ticket_id"],
        "second_verified_at": second["verified_at"],
        "second_inspector": second["inspector"],
        "label": (
            f"重复隐患：第{first['ticket_id']}单 {first['verified_at']} {first['inspector']} 复验未通过；"
            f"第{second['ticket_id']}单 {second['verified_at']} {second['inspector']} 复验仍未通过"
        ),
    }
    return {first["ticket_id"]: detail, second["ticket_id"]: detail}
