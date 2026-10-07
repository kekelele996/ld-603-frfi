from src.seed import seed


class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]

    def find(self, ticket_id):
        return next((row for row in seed["hazardTicket"] if row["id"] == ticket_id), None)

    def update(self, ticket_id, **changes):
        ticket = self.find(ticket_id)
        if ticket is None:
            return None
        ticket.update(changes)
        return ticket

    def result(self, result_id):
        return next((row for row in seed["inspectionResult"] if row["id"] == result_id), None)

    def device(self, device_id):
        return next((row for row in seed["fireDevice"] if row["id"] == device_id), None)
