from pydantic import BaseModel

class HazardRecheck(BaseModel):
    id: int | float
    ticket_id: int | float
    recheck_date: str
    inspector_name: str
    conclusion: str
    next_deadline: str = ""
    created_at: str = ""

class HazardTicket(BaseModel):
    id: int | float
    result_id: int | float
    device_id: int | float = 0
    severity: str
    owner_id: int | float
    deadline: str
    rectify_status: str
    rectify_note: str
    closed_at: str
    rechecks: list[HazardRecheck] = []
