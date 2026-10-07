from fastapi import APIRouter
from src.controllers.hazard_ticket_controller import (
    list_hazard_ticket,
    rectify_hazard_ticket,
    recheck_hazard_ticket,
)

router = APIRouter(prefix="/api/hazard-ticket", tags=["HazardTicket"])
router.get("")(list_hazard_ticket)
router.patch("/{ticket_id}/rectify")(rectify_hazard_ticket)
router.post("/{ticket_id}/recheck")(recheck_hazard_ticket)
