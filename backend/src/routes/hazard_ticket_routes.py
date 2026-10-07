from fastapi import APIRouter

from src.controllers.hazard_ticket_controller import (
    add_rectify_note,
    add_verification,
    get_hazard_ticket,
    list_hazard_ticket,
)

router = APIRouter(prefix="/api/hazard-ticket", tags=["HazardTicket"])
router.get("")(list_hazard_ticket)
router.get("/{ticket_id}")(get_hazard_ticket)
router.post("/{ticket_id}/rectify-note")(add_rectify_note)
router.post("/{ticket_id}/verification")(add_verification)
