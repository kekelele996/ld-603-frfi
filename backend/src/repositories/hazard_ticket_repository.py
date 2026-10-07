from src.seed import seed
from src.constructors.hazard_recheck_factory import create_hazard_recheck_dto


class HazardTicketNotFound(Exception):
    pass


class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]

    def find_by_id(self, ticket_id):
        for row in seed["hazardTicket"]:
            if int(row["id"]) == int(ticket_id):
                return row
        raise HazardTicketNotFound(ticket_id)

    def save_rectify_note(self, ticket_id, rectify_note):
        ticket = self.find_by_id(ticket_id)
        ticket["rectify_note"] = rectify_note
        return ticket

    def add_recheck(self, ticket_id, recheck_date, inspector_name, conclusion, next_deadline=""):
        ticket = self.find_by_id(ticket_id)
        recheck = create_hazard_recheck_dto(
            ticket_id=int(ticket["id"]),
            recheck_date=recheck_date,
            inspector_name=inspector_name,
            conclusion=conclusion,
            next_deadline=next_deadline,
            id=max([int(item.get("id", 0)) for item in self._all_rechecks()] + [0]) + 1,
        )
        ticket.setdefault("rechecks", []).append(recheck)
        if conclusion == "PASS":
            ticket["closed_at"] = recheck["created_at"]
        return ticket

    def _all_rechecks(self):
        records = []
        for ticket in seed["hazardTicket"]:
            records.extend(ticket.get("rechecks") or [])
        return records
