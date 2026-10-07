from src.repositories.hazard_ticket_repository import HazardTicketRepository, HazardTicketNotFound
from src.constructors.hazard_ticket_factory import create_hazard_ticket_view
from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.recheck_conclusion import RecheckConclusion
from src.utils.formatters import (
    derive_deadline,
    derive_rectify_status,
    format_recheck_conclusion,
)


class HazardServiceError(Exception):
    def __init__(self, code):
        super().__init__(ERROR_MESSAGES[code])
        self.code = code


class HazardTicketService:
    def __init__(self):
        self.repo = HazardTicketRepository()

    def list(self):
        repeats = self._find_latest_failed_pairs()
        return [self._to_view(ticket, repeats) for ticket in self.repo.find_all()]

    def add_rectify_note(self, ticket_id, payload):
        note = str((payload or {}).get("rectify_note", "")).strip()
        if not note:
            raise HazardServiceError(ERROR_CODES["RECTIFY_PAYLOAD_INVALID"])
        ticket = self._guard(lambda: self.repo.save_rectify_note(ticket_id, note))
        self._audit(LOG_TEMPLATES["HazardTicket"][4], ticket["id"])
        return self._to_view(ticket, self._find_latest_failed_pairs())

    def add_recheck(self, ticket_id, payload):
        payload = payload or {}
        recheck_date = str(payload.get("recheck_date", "")).strip()
        inspector_name = str(payload.get("inspector_name", "")).strip()
        conclusion = str(payload.get("conclusion", "")).strip()
        next_deadline = str(payload.get("next_deadline", "")).strip()
        if not recheck_date or not inspector_name or conclusion not in RecheckConclusion:
            raise HazardServiceError(ERROR_CODES["RECHECK_PAYLOAD_INVALID"])
        if conclusion == "PASS":
            next_deadline = ""
        ticket = self._guard(
            lambda: self.repo.add_recheck(
                ticket_id, recheck_date, inspector_name, conclusion, next_deadline
            )
        )
        self._audit(LOG_TEMPLATES["HazardTicket"][5], ticket["id"], conclusion)
        return self._to_view(ticket, self._find_latest_failed_pairs())

    def _guard(self, action):
        try:
            return action()
        except HazardTicketNotFound:
            raise HazardServiceError(ERROR_CODES["HAZARD_TICKET_NOT_FOUND"])

    def _audit(self, template, ticket_id, conclusion=None):
        suffix = f" conclusion={format_recheck_conclusion(conclusion)}" if conclusion else ""
        print(f"audit {template} target=HazardTicket#{ticket_id}{suffix}")

    def _find_latest_failed_pairs(self):
        """按设备汇总全部复验记录；最近两次复验都是 FAIL，则拥有最近一次的单据算重复隐患。

        返回 {ticket_id: [最近一次复验, 上一次复验]}，供列表写明是哪两次。
        """
        by_device = {}
        for ticket in self.repo.find_all():
            device_id = ticket.get("device_id")
            for recheck in ticket.get("rechecks") or []:
                by_device.setdefault(device_id, []).append((ticket, recheck))
        pairs = {}
        for entries in by_device.values():
            entries.sort(key=lambda entry: (entry[1].get("recheck_date", ""), entry[1].get("created_at", "")))
            if len(entries) >= 2 and entries[-1][1].get("conclusion") == "FAIL" and entries[-2][1].get("conclusion") == "FAIL":
                # 键为最近一次复验所在单据，值保留每次复验各自所属单据
                latest_ticket_id = entries[-1][0]["id"]
                pairs[latest_ticket_id] = [entries[-1], entries[-2]]
        return pairs

    def _to_view(self, ticket, repeat_pairs):
        pair = repeat_pairs.get(ticket["id"])
        view = create_hazard_ticket_view(
            **ticket,
            effective_status=derive_rectify_status(ticket),
            effective_deadline=derive_deadline(ticket),
            repeat_hazard=bool(pair),
            repeat_rechecks=[self._repeat_ref(owner, recheck) for owner, recheck in pair] if pair else [],
        )
        if pair:
            view["repeat_detail"] = self._build_repeat_detail(view["repeat_rechecks"])
        return view

    def _repeat_ref(self, ticket, recheck):
        return {
            "ticket_id": ticket["id"],
            "recheck_id": recheck.get("id"),
            "recheck_date": recheck.get("recheck_date", ""),
            "inspector_name": recheck.get("inspector_name", ""),
            "conclusion": recheck.get("conclusion", ""),
        }

    def _build_repeat_detail(self, refs):
        parts = [
            f"隐患单#{ref['ticket_id']} {ref['recheck_date']} {ref['inspector_name']}复验{format_recheck_conclusion(ref['conclusion'])}"
            for ref in refs
        ]
        return "该设备最近两次复验均未通过：" + "；".join(parts) + "。"
