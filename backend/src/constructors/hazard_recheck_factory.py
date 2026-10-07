from datetime import datetime, timedelta


def create_hazard_recheck_dto(ticket_id, recheck_date, inspector_name, conclusion, next_deadline="", **overrides):
    """构造一条复验记录。复验未过且未指定续期时，默认顺延 3 天整改期限。"""
    if conclusion == "FAIL" and not next_deadline and recheck_date:
        try:
            next_deadline = (datetime.fromisoformat(recheck_date) + timedelta(days=3)).date().isoformat()
        except ValueError:
            next_deadline = ""
    row = {
        "id": overrides.pop("id", 0),
        "ticket_id": ticket_id,
        "recheck_date": recheck_date,
        "inspector_name": inspector_name,
        "conclusion": conclusion,
        "next_deadline": next_deadline,
        "created_at": overrides.pop("created_at", datetime.utcnow().isoformat()),
    }
    row.update(overrides)
    return row
