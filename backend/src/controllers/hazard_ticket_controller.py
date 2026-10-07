from fastapi.responses import JSONResponse
from src.services.hazard_ticket_service import HazardTicketService, HazardServiceError
from src.constants.error_codes import ERROR_CODES
from src.middlewares.error_handler_middleware import to_error_payload

service = HazardTicketService()


def list_hazard_ticket():
    try:
        return service.list()
    except HazardServiceError as exc:
        return JSON_response(exc)


def rectify_hazard_ticket(ticket_id: int, payload: dict):
    try:
        return service.add_rectify_note(ticket_id, payload)
    except HazardServiceError as exc:
        return JSON_response(exc)


def recheck_hazard_ticket(ticket_id: int, payload: dict):
    try:
        return service.add_recheck(ticket_id, payload)
    except HazardServiceError as exc:
        return JSON_response(exc)


def JSON_response(exc):
    status = 404 if exc.code == ERROR_CODES["HAZARD_TICKET_NOT_FOUND"] else 400
    return JSONResponse(status_code=status, content=to_error_payload(exc))
