from pydantic import BaseModel


class VerificationPayload(BaseModel):
    verified_at: str
    inspector: str
    result: str
    note: str = ""
    new_deadline: str = ""


class RectifyNotePayload(BaseModel):
    rectify_note: str
