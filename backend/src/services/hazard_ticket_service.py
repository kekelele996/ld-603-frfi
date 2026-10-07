from datetime import date

from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.verification_repository import VerificationRepository
from src.seed import seed
from src.constructors.hazard_ticket_factory import build_hazard_ticket_response
from src.constructors.verification_factory import create_verification_dto
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.verification_result import PASS, VERIFICATION_RESULTS
from src.utils.errors import NotFoundError, ValidationError
from src.utils import audit
from src.services import hazard_domain


class HazardTicketService:
    def __init__(self):
        self.repo = HazardTicketRepository()
        self.verification_repo = VerificationRepository()

    def list(self):
        tickets = self.repo.find_all()
        repeats = hazard_domain.derive_repeat_hazards(
            tickets, self.verification_repo.find_all(), seed["inspectionResult"]
        )
        today = date.today().isoformat()
        return [self._enrich(ticket, today, repeats) for ticket in tickets]

    def get(self, ticket_id: int):
        ticket = self.repo.find(ticket_id)
        if ticket is None:
            raise NotFoundError(ERROR_MESSAGES["HAZARD_TICKET_NOT_FOUND"], code="NOT_FOUND")
        return self._enrich(ticket, date.today().isoformat())

    def add_rectify_note(self, ticket_id: int, note: str, actor="维保整改账号"):
        """整改人补录整改说明；提交后单子进入待复验。"""
        ticket = self.repo.find(ticket_id)
        if ticket is None:
            raise NotFoundError(ERROR_MESSAGES["HAZARD_TICKET_NOT_FOUND"], code="NOT_FOUND")
        note = (note or "").strip()
        if not note:
            raise ValidationError(ERROR_MESSAGES["RECTIFY_NOTE_REQUIRED"])
        self.repo.update(
            ticket_id,
            rectify_note=note,
            rectified_at=date.today().isoformat(),
        )
        audit.record("HazardTicket.rectify_note", "HazardTicket", ticket_id, actor=actor)
        return self.get(ticket_id)

    def add_verification(self, ticket_id: int, payload: dict, actor="物业复验账号"):
        """补记复验：复验日期、复验人、结论（可附新整改期限与说明）。"""
        ticket = self.repo.find(ticket_id)
        if ticket is None:
            raise NotFoundError(ERROR_MESSAGES["HAZARD_TICKET_NOT_FOUND"], code="NOT_FOUND")

        verified_at = (payload.get("verified_at") or "").strip()
        inspector = (payload.get("inspector") or "").strip()
        result = (payload.get("result") or "").strip()
        if not verified_at:
            raise ValidationError(ERROR_MESSAGES["VERIFICATION_DATE_REQUIRED"])
        if not inspector:
            raise ValidationError(ERROR_MESSAGES["VERIFICATION_INSPECTOR_REQUIRED"])
        if result not in VERIFICATION_RESULTS:
            raise ValidationError(ERROR_MESSAGES["VERIFICATION_RESULT_REQUIRED"])

        row = create_verification_dto(
            id=self.verification_repo.next_id(),
            ticket_id=ticket_id,
            verified_at=verified_at,
            inspector=inspector,
            result=result,
            note=(payload.get("note") or "").strip(),
            new_deadline=(payload.get("new_deadline") or "").strip(),
        )
        self.verification_repo.add(row)

        # 复验通过即闭环；未通过保持打开并由复验结论重新推导期限
        if result == PASS:
            self.repo.update(ticket_id, closed_at=verified_at)
        audit.record(
            "HazardTicket.verification", "HazardTicket", ticket_id,
            actor=actor, inspector=inspector, verified_at=verified_at,
            result="复验通过" if result == PASS else "复验未通过",
        )
        return self.get(ticket_id)

    def _enrich(self, ticket: dict, today: str, repeats: dict | None = None):
        ticket_verifications = self.verification_repo.find_by_ticket(ticket["id"])
        state = hazard_domain.derive_ticket_state(ticket, ticket_verifications, today)
        result = self.repo.result(ticket["result_id"])
        device = self.repo.device(result["device_id"]) if result else None
        if repeats is None:
            repeats = hazard_domain.derive_repeat_hazards(
                self.repo.find_all(), self.verification_repo.find_all(),
                seed["inspectionResult"],
            )
        repeat = repeats.get(ticket["id"])
        return build_hazard_ticket_response(ticket, state, device, repeat)
