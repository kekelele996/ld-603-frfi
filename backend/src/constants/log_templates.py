LOG_TEMPLATES = {
  "Building": [
    "Building.create",
    "Building.update",
    "Building.status",
    "Building.export"
  ],
  "FireDevice": [
    "FireDevice.create",
    "FireDevice.update",
    "FireDevice.status",
    "FireDevice.export"
  ],
  "InspectionTask": [
    "InspectionTask.create",
    "InspectionTask.update",
    "InspectionTask.status",
    "InspectionTask.export"
  ],
  "InspectionResult": [
    "InspectionResult.create",
    "InspectionResult.update",
    "InspectionResult.status",
    "InspectionResult.export"
  ],
  "HazardTicket": [
    "HazardTicket.create",
    "HazardTicket.update",
    "HazardTicket.status",
    "HazardTicket.export",
    # 复验 / 整改补录是隐患单的核心写动作，字段变更时同步改这里和调用处
    "HazardTicket.rectify_note",
    "HazardTicket.verification"
  ],
  "Verification": [
    "Verification.create",
    "Verification.update",
    "Verification.status",
    "Verification.export"
  ]
}

# 结构化日志模板：写操作统一走这里渲染
LOG_MESSAGE_TEMPLATES = {
    "HazardTicket.create": "隐患单 #{target_id} 创建，分级 {severity}",
    "HazardTicket.rectify_note": "隐患单 #{target_id} 整改人 {actor} 补录整改说明",
    "HazardTicket.verification": "隐患单 #{target_id} 复验人 {inspector} 于 {verified_at} 复验，结论：{result}",
}
