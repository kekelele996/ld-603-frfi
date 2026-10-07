from pydantic import BaseModel


class Verification(BaseModel):
    """隐患单复验记录（一张单可多次复验）。"""

    id: int
    ticket_id: int
    verified_at: str
    inspector: str
    result: str  # PASS / FAIL
    note: str = ""
    new_deadline: str = ""
