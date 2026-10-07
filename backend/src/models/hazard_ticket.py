from pydantic import BaseModel


class HazardTicket(BaseModel):
    id: int
    result_id: int
    severity: str
    owner_id: int
    owner_name: str = ""
    deadline: str
    rectify_note: str = ""
    rectified_at: str = ""
    closed_at: str = ""
