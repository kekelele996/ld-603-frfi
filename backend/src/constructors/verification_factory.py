def create_verification_dto(**overrides):
    row = {
        "id": 1,
        "ticket_id": 1,
        "verified_at": "",
        "inspector": "",
        "result": "PASS",
        "note": "",
        "new_deadline": "",
    }
    row.update(overrides)
    return row


def build_verification_response(row: dict) -> dict:
    return dict(row)
