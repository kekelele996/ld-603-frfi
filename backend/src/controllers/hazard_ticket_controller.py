from fastapi import HTTPException

from src.services.hazard_ticket_service import HazardTicketService
from src.types.hazard_ticket_payload import RectifyNotePayload, VerificationPayload
from src.utils.errors import FireInspectError

service = HazardTicketService()


def _raise_http(error: FireInspectError):
    # controller 层把领域异常翻译成 HTTP 错误码，service 不感知 HTTP
    status = 404 if error.code == "NOT_FOUND" else 400
    raise HTTPException(status_code=status, detail={"code": error.code, "message": str(error)})


def list_hazard_ticket():
    try:
        return service.list()
    except FireInspectError as error:
        _raise_http(error)


def get_hazard_ticket(ticket_id: int):
    try:
        return service.get(ticket_id)
    except FireInspectError as error:
        _raise_http(error)


def add_rectify_note(ticket_id: int, payload: RectifyNotePayload):
    try:
        return service.add_rectify_note(ticket_id, payload.rectify_note)
    except FireInspectError as error:
        _raise_http(error)


def add_verification(ticket_id: int, payload: VerificationPayload):
    try:
        return service.add_verification(ticket_id, payload.model_dump())
    except FireInspectError as error:
        _raise_http(error)
