from src.seed import seed


class VerificationRepository:
    def find_all(self):
        return seed["verification"]

    def find_by_ticket(self, ticket_id):
        return [row for row in seed["verification"] if row["ticket_id"] == ticket_id]

    def next_id(self):
        return max((row["id"] for row in seed["verification"]), default=0) + 1

    def add(self, row):
        seed["verification"].append(row)
        return row
