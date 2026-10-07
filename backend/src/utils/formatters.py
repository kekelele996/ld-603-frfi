from src.constants.rectify_status import RectifyStatusText
from src.constants.recheck_conclusion import RecheckConclusionText


def audit_target(kind, id):
    return f"{kind}#{id}"


def format_rectify_status(value):
    return RectifyStatusText.get(value, value)


def format_recheck_conclusion(value):
    return RecheckConclusionText.get(value, value)


def latest_recheck(ticket):
    """取一张隐患单最近一次复验（补记顺序即时间顺序）。"""
    rechecks = ticket.get("rechecks") or []
    return rechecks[-1] if rechecks else None


def derive_rectify_status(ticket):
    """整改状态改用最近一次复验结论；未复验时回退到整改说明补录情况。"""
    last = latest_recheck(ticket)
    if last:
        return "CLOSED" if last.get("conclusion") == "PASS" else "RECHECK_FAILED"
    if ticket.get("rectify_note"):
        return "RECTIFYING"
    return "PENDING"


def derive_deadline(ticket):
    """整改期限改用最近一次复验结论：复验未过取复验续期，复验通过不再占用期限。"""
    last = latest_recheck(ticket)
    if last:
        if last.get("conclusion") == "PASS":
            return ""
        return last.get("next_deadline") or ticket.get("deadline", "")
    return ticket.get("deadline", "")
