import type { Building } from "../types/Building";
import type { FireDevice } from "../types/FireDevice";
import type { InspectionTask } from "../types/InspectionTask";
import type { InspectionResult } from "../types/InspectionResult";
import type { HazardTicket } from "../types/HazardTicket";
import type { Verification } from "../types/Verification";

/**
 * 本地种子数据（离线评审用，禁止第三方 API）。
 * hazardTicket 只存单上原始字段；rectify_status / effective_deadline /
 * closed_at / repeat_hazard 等一律由 utils/hazardDerivation 从复验记录推导。
 */
export const mockData: {
  building: Building[];
  fireDevice: FireDevice[];
  inspectionTask: InspectionTask[];
  inspectionResult: InspectionResult[];
  hazardTicket: HazardTicket[];
  verification: Verification[];
} = {
  building: [
    { id: 1, name: "A栋研发楼", campus: "滨河科技园", floor_count: 12, fire_grade: "一级", manager_id: 1, address_code: "BH-A-01" },
    { id: 2, name: "B栋宿舍楼", campus: "滨河科技园", floor_count: 8, fire_grade: "二级", manager_id: 2, address_code: "BH-B-02" }
  ],
  fireDevice: [
    { id: 1, building_id: 1, device_code: "EXT-1001", device_type: "EXTINGUISHER", floor: "3F", location_desc: "A栋3层茶水间旁", install_date: "2023-05-10", status: "FAULT", next_maintenance_at: "2026-11-01" },
    { id: 2, building_id: 1, device_code: "EXT-1002", device_type: "EXTINGUISHER", floor: "1F", location_desc: "A栋1层大堂前台", install_date: "2022-03-18", status: "FAULT", next_maintenance_at: "2026-11-01" },
    { id: 3, building_id: 2, device_code: "SD-2001", device_type: "SMOKE_DETECTOR", floor: "5F", location_desc: "B栋5层东侧走廊", install_date: "2024-01-22", status: "MAINTAINING", next_maintenance_at: "2026-12-15" },
    { id: 4, building_id: 1, device_code: "SP-3001", device_type: "SPRINKLER", floor: "B1", location_desc: "A栋地下车库喷淋泵房", install_date: "2021-11-08", status: "NORMAL", next_maintenance_at: "2026-10-30" }
  ],
  inspectionTask: [
    { id: 1, building_id: 1, inspector_id: 1, plan_date: "2026-09-10", task_type: "MONTHLY", status: "REVIEWED", checklist_version: "v2026.3", finished_at: "2026-09-10" },
    { id: 2, building_id: 1, inspector_id: 1, plan_date: "2026-10-03", task_type: "SPECIAL", status: "REVIEWED", checklist_version: "v2026.3", finished_at: "2026-10-03" },
    { id: 3, building_id: 2, inspector_id: 2, plan_date: "2026-09-28", task_type: "MONTHLY", status: "REVIEWED", checklist_version: "v2026.3", finished_at: "2026-09-28" },
    { id: 4, building_id: 1, inspector_id: 1, plan_date: "2026-09-20", task_type: "MONTHLY", status: "REVIEWED", checklist_version: "v2026.3", finished_at: "2026-09-20" }
  ],
  inspectionResult: [
    { id: 1, task_id: 1, device_id: 1, item_code: "EXT-PRESSURE", result_status: "ABNORMAL", measured_value: "压力表指针位于红区", photo_url: "/mock/ext-1001-0910.jpg", note: "灭火器压力不足，需尽快更换" },
    { id: 2, task_id: 2, device_id: 1, item_code: "EXT-APPEARANCE", result_status: "ABNORMAL", measured_value: "喷管开裂", photo_url: "/mock/ext-1001-1003.jpg", note: "复检仍发现喷管老化开裂，上次问题未修干净" },
    { id: 3, task_id: 4, device_id: 2, item_code: "EXT-EXPIRE", result_status: "ABNORMAL", measured_value: "出厂满5年未水压试验", photo_url: "/mock/ext-1002.jpg", note: "灭火器超期，安排送检" },
    { id: 4, task_id: 3, device_id: 3, item_code: "SD-ALARM", result_status: "ABNORMAL", measured_value: "一周内误报3次", photo_url: "/mock/sd-2001.jpg", note: "烟感频繁误报，需清洁或更换探测器" },
    { id: 5, task_id: 4, device_id: 4, item_code: "SP-WATER-PRESSURE", result_status: "ABNORMAL", measured_value: "0.4MPa（标准≥0.6MPa）", photo_url: "/mock/sp-3001.jpg", note: "喷淋管网压力偏低" }
  ],
  hazardTicket: [
    { id: 1, result_id: 1, severity: "HIGH", owner_id: 1, owner_name: "安盾消防·李工", deadline: "2026-09-20", rectify_note: "已更换同型号4kg干粉灭火器，瓶体编号 AH-2026-0881", rectified_at: "2026-09-18", closed_at: "" },
    { id: 2, result_id: 2, severity: "HIGH", owner_id: 1, owner_name: "安盾消防·李工", deadline: "2026-10-10", rectify_note: "再次更换喷管并补充灭火剂", rectified_at: "2026-10-04", closed_at: "" },
    { id: 3, result_id: 3, severity: "MEDIUM", owner_id: 2, owner_name: "永晟维保·赵工", deadline: "2026-10-12", rectify_note: "灭火器已拆下送检，预计10月9日装回，期间放置备用瓶", rectified_at: "2026-10-06", closed_at: "" },
    { id: 4, result_id: 4, severity: "LOW", owner_id: 2, owner_name: "永晟维保·赵工", deadline: "2026-09-30", rectify_note: "", rectified_at: "", closed_at: "" },
    { id: 5, result_id: 5, severity: "CRITICAL", owner_id: 1, owner_name: "安盾消防·李工", deadline: "2026-09-25", rectify_note: "维修稳压泵并补水，管网压力恢复 0.7MPa", rectified_at: "2026-09-23", closed_at: "" }
  ],
  verification: [
    { id: 1, ticket_id: 1, verified_at: "2026-09-19", inspector: "周敏", result: "FAIL", note: "压力仍处红区，疑似瓶体未实际更换", new_deadline: "2026-09-30" },
    { id: 2, ticket_id: 2, verified_at: "2026-10-05", inspector: "周敏", result: "FAIL", note: "喷管仍有裂纹，复验不合格", new_deadline: "2026-10-15" },
    { id: 3, ticket_id: 5, verified_at: "2026-09-24", inspector: "王磊", result: "PASS", note: "稳压泵运行正常，管网压力达标", new_deadline: "" }
  ]
};
