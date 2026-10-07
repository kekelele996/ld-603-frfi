# 消防设施巡检维保平台

面向园区和物业公司的消防设备巡检、隐患整改、维保计划和合规台账系统。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20103>

后端健康检查：<http://localhost:21103/health>

隐患整改接口（复验 / 整改补录）：

```bash
# 隐患列表（整改状态、期限、重复隐患均由复验结论推导）
curl http://localhost:21103/api/hazard-ticket

# 整改人补录整改说明
curl -X POST http://localhost:21103/api/hazard-ticket/4/rectify-note \
  -H 'Content-Type: application/json' \
  -d '{"rectify_note":"已更换同型号探测器并完成联调"}'

# 补记复验：复验日期、复验人、结论（FAIL 时可给 new_deadline 新整改期限）
curl -X POST http://localhost:21103/api/hazard-ticket/1/verification \
  -H 'Content-Type: application/json' \
  -d '{"verified_at":"2026-10-08","inspector":"周敏","result":"PASS","note":"现场复核合格","new_deadline":""}'
```

## 隐患复验业务规则

维保商电话复验后，在系统里对每张隐患单**补记复验**（复验日期、复验人、结论，可附说明；复验未通过时可重新给定期限），整改人也可**补录整改说明**。保存后：

- **整改状态**以最近一次复验结论为准：待整改（未提交说明）→ 待复验（已补录说明）→ 复验通过为「已闭环」，复验未通过为「整改不合格」。
- **整改期限**取复验未通过时填写的新期限，未填则沿用建单期限；已闭环单不再计逾期。
- **隐患列表顶部计数**（待整改/待复验/不合格/重复隐患/逾期/未闭环/已闭环）全部按复验后的状态统计。
- **重复隐患**：同一台设备最近两次复验都未通过时，涉及的两张隐患单标红为「重复隐患」，并写明是第几张单、哪一天、哪位复验人的两次复验。

## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：`cd backend && pip install -r requirements.txt && uvicorn src.main:app --reload --port 8000`，接口统一挂在 `/api`。
- 数据来自本地种子数据（`backend/src/seed.py` 与 `frontend/src/mocks/seedData.ts`），前端在后端不可用时按同一套推导规则离线运行。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Redux Toolkit（状态层用 zustand store） |
| 后端 | FastAPI + Python 3.11 + SQLAlchemy 2.0 |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, components/hazard, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `fire-inspect`
- `FRONTEND_PORT`: 前端端口，默认 `20103`
- `BACKEND_PORT`: 后端端口，默认 `21103`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: fire-inspect`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-fire-inspect}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceType: 后端 `constants/device_type.py`；前端 `constants/DeviceType.ts`、`types/DeviceType.ts`、constructors、logTemplates、errorMessages、筛选器、展示组件均有引用。
- InspectionStatus: 后端 `constants/inspection_status.py`；前端 `constants/InspectionStatus.ts`、`types/InspectionStatus.ts`、constructors、logTemplates、errorMessages、筛选器、展示组件均有引用。
- HazardSeverity: 后端 `constants/hazard_severity.py`；前端 `constants/HazardSeverity.ts`、`types/HazardSeverity.ts`、`HazardSeverityTag`、formatRisk、列表筛选与徽标均有引用。
- **RectifyStatus（整改状态，新增）**：后端 `constants/rectify_status.py`（模型/服务/工厂/控制器引用）、`database/init.sql` 的 `rectify_status` 列；前端 `constants/RectifyStatus.ts`、`constants/statusText.ts`、`utils/formatters.ts` 的 `formatRectifyStatus`、`components/common/StatusBadge`、`pages/HazardsPage` 顶部计数与筛选、`components/hazard/HazardTicketDrawer`。
- **VerificationResult（复验结论，新增）**：后端 `constants/verification_result.py`、`models/verification.py`、`types/hazard_ticket_payload.py`、`services/hazard_ticket_service.py`、`services/hazard_domain.py`、`constructors/verification_factory.py`、`repositories/verification_repository.py`、日志/错误模板；前端 `constants/VerificationResult.ts`、`types/Verification.ts`、`utils/hazardDerivation.ts`、`components/hazard/VerificationDialog` 与 `VerificationTimeline`。

### 复验功能涉及的关键文件

- 后端：`models/verification.py`、`repositories/verification_repository.py`、`services/hazard_domain.py`（状态/期限/重复隐患推导）、`services/hazard_ticket_service.py`、`controllers/hazard_ticket_controller.py`、`routes/hazard_ticket_routes.py`、`constructors/verification_factory.py`、`utils/audit.py`。
- 前端：`api/HazardTicket.ts`、`stores/HazardTicketStore.ts`、`utils/hazardDerivation.ts`、`components/hazard/*`（RepeatHazardTag / VerificationTimeline / VerificationDialog / RectifyNoteDialog / HazardTicketDrawer）、`pages/HazardsPage.tsx`。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。复验结论是整改状态/期限/计数/重复隐患的唯一事实来源，规则同时落在后端 `services/hazard_domain.py` 与前端 `utils/hazardDerivation.ts`，改规则必须两处同改。

## License

MIT
