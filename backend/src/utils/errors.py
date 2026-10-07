"""业务异常：service 与 controller 分别包装，禁止全局吞掉。"""


class FireInspectError(Exception):
    code = "INTERNAL_ERROR"

    def __init__(self, message: str, *, code: str | None = None):
        super().__init__(message)
        if code:
            self.code = code


class ValidationError(FireInspectError):
    code = "VALIDATION_FAILED"


class NotFoundError(FireInspectError):
    code = "NOT_FOUND"
