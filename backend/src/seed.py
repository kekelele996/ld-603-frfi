seed = {
  "building": [
    {
      "id": 1,
      "name": "研发楼A座",
      "campus": "东园区",
      "floor_count": "12",
      "fire_grade": "一级",
      "manager_id": 1,
      "address_code": "D1001"
    },
    {
      "id": 2,
      "name": "综合楼B座",
      "campus": "东园区",
      "floor_count": "8",
      "fire_grade": "二级",
      "manager_id": 2,
      "address_code": "D1002"
    },
    {
      "id": 3,
      "name": "仓储中心",
      "campus": "西园区",
      "floor_count": "3",
      "fire_grade": "一级",
      "manager_id": 3,
      "address_code": "X2001"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "XF-SQ-0101",
      "device_type": "SPRINKLER",
      "floor": "1F",
      "location_desc": "研发楼A座一层大堂吊顶",
      "install_date": "2024-03-12",
      "status": "FAULT",
      "next_maintenance_at": "2026-11-01"
    },
    {
      "id": 2,
      "building_id": 1,
      "device_code": "XF-YT-0208",
      "device_type": "HYDRANT",
      "floor": "2F",
      "location_desc": "研发楼A座二层东侧消火栓箱",
      "install_date": "2023-09-02",
      "status": "FAULT",
      "next_maintenance_at": "2026-10-20"
    },
    {
      "id": 3,
      "building_id": 2,
      "device_code": "XF-MH-0305",
      "device_type": "SMOKE_DETECTOR",
      "floor": "3F",
      "location_desc": "综合楼B座三层会议室",
      "install_date": "2024-06-20",
      "status": "NORMAL",
      "next_maintenance_at": "2026-12-15"
    },
    {
      "id": 4,
      "building_id": 2,
      "device_code": "XF-JD-0102",
      "device_type": "EXIT_LIGHT",
      "floor": "1F",
      "location_desc": "综合楼B座一层疏散通道",
      "install_date": "2023-11-05",
      "status": "FAULT",
      "next_maintenance_at": "2026-10-10"
    },
    {
      "id": 5,
      "building_id": 3,
      "device_code": "XF-MH-0211",
      "device_type": "EXTINGUISHER",
      "floor": "2F",
      "location_desc": "仓储中心二层库区入口",
      "install_date": "2025-01-18",
      "status": "FAULT",
      "next_maintenance_at": "2026-11-30"
    },
    {
      "id": 6,
      "building_id": 3,
      "device_code": "XF-SQ-0106",
      "device_type": "SPRINKLER",
      "floor": "1F",
      "location_desc": "仓储中心一层卸货区",
      "install_date": "2024-08-30",
      "status": "FAULT",
      "next_maintenance_at": "2026-10-25"
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 1,
      "plan_date": "2026-09-01",
      "task_type": "MONTHLY",
      "status": "REVIEWED",
      "checklist_version": "v3.2",
      "finished_at": "2026-09-01T17:20:00Z"
    },
    {
      "id": 2,
      "building_id": 2,
      "inspector_id": 2,
      "plan_date": "2026-09-05",
      "task_type": "MONTHLY",
      "status": "REVIEWED",
      "checklist_version": "v3.2",
      "finished_at": "2026-09-05T16:40:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "inspector_id": 3,
      "plan_date": "2026-09-08",
      "task_type": "WEEKLY",
      "status": "REVIEWED",
      "checklist_version": "v3.2",
      "finished_at": "2026-09-08T11:05:00Z"
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 1,
      "device_id": 1,
      "item_code": "SPRINKLER-PRESSURE",
      "result_status": "ABNORMAL",
      "measured_value": "末端试水压力 0.03MPa",
      "photo_url": "/mock/sprinkler-1.png",
      "note": "一层喷淋末端压力不足，管网疑似渗漏"
    },
    {
      "id": 2,
      "task_id": 1,
      "device_id": 2,
      "item_code": "HYDRANT-WATER",
      "result_status": "ABNORMAL",
      "measured_value": "水带老化龟裂",
      "photo_url": "/mock/hydrant-1.png",
      "note": "消火栓箱内水带多处龟裂，需更换"
    },
    {
      "id": 3,
      "task_id": 2,
      "device_id": 3,
      "item_code": "DETECTOR-ALARM",
      "result_status": "NORMAL",
      "measured_value": "报警测试正常",
      "photo_url": "/mock/detector-1.png",
      "note": "烟感联动正常"
    },
    {
      "id": 4,
      "task_id": 2,
      "device_id": 4,
      "item_code": "EXITLIGHT-BATTERY",
      "result_status": "ABNORMAL",
      "measured_value": "应急续航 12 分钟",
      "photo_url": "/mock/exitlight-1.png",
      "note": "疏散指示应急时间不足 30 分钟，电池衰减"
    },
    {
      "id": 5,
      "task_id": 3,
      "device_id": 5,
      "item_code": "EXTINGUISHER-PRESSURE",
      "result_status": "ABNORMAL",
      "measured_value": "压力表指针进红区",
      "photo_url": "/mock/extinguisher-1.png",
      "note": "灭火器欠压，需充压或更换"
    },
    {
      "id": 6,
      "task_id": 3,
      "device_id": 6,
      "item_code": "SPRINKLER-HEAD",
      "result_status": "ABNORMAL",
      "measured_value": "喷头被货物遮挡",
      "photo_url": "/mock/sprinkler-2.png",
      "note": "卸货区喷淋头下方堆货，间距不足"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 1,
      "device_id": 1,
      "severity": "HIGH",
      "owner_id": 11,
      "deadline": "2026-09-15",
      "rectify_status": "RECHECK_FAILED",
      "rectify_note": "已紧固一层管网接口并补压，渗漏点观察中。",
      "closed_at": "",
      "rechecks": [
        {
          "id": 1,
          "ticket_id": 1,
          "recheck_date": "2026-09-14",
          "inspector_name": "周维保",
          "conclusion": "FAIL",
          "next_deadline": "2026-09-21",
          "created_at": "2026-09-14T10:20:00Z"
        }
      ]
    },
    {
      "id": 2,
      "result_id": 2,
      "device_id": 2,
      "severity": "MEDIUM",
      "owner_id": 12,
      "deadline": "2026-09-18",
      "rectify_status": "CLOSED",
      "rectify_note": "已更换 25m 国标消防水带并加装箱内卡扣。",
      "closed_at": "2026-09-20T15:10:00Z",
      "rechecks": [
        {
          "id": 2,
          "ticket_id": 2,
          "recheck_date": "2026-09-16",
          "inspector_name": "周维保",
          "conclusion": "FAIL",
          "next_deadline": "2026-09-22",
          "created_at": "2026-09-16T09:30:00Z"
        },
        {
          "id": 3,
          "ticket_id": 2,
          "recheck_date": "2026-09-20",
          "inspector_name": "周维保",
          "conclusion": "PASS",
          "next_deadline": "",
          "created_at": "2026-09-20T15:10:00Z"
        }
      ]
    },
    {
      "id": 3,
      "result_id": 4,
      "device_id": 4,
      "severity": "HIGH",
      "owner_id": 11,
      "deadline": "2026-09-19",
      "rectify_status": "PENDING",
      "rectify_note": "",
      "closed_at": "",
      "rechecks": []
    },
    {
      "id": 4,
      "result_id": 5,
      "device_id": 5,
      "severity": "MEDIUM",
      "owner_id": 13,
      "deadline": "2026-09-20",
      "rectify_status": "RECTIFYING",
      "rectify_note": "灭火器已拆走充压，预计 9 月 25 日复装。",
      "closed_at": "",
      "rechecks": []
    },
    {
      "id": 5,
      "result_id": 6,
      "device_id": 6,
      "severity": "LOW",
      "owner_id": 13,
      "deadline": "2026-09-22",
      "rectify_status": "RECHECK_FAILED",
      "rectify_note": "已要求库管挪货并划线留出 0.5m 间距。",
      "closed_at": "",
      "rechecks": [
        {
          "id": 4,
          "ticket_id": 5,
          "recheck_date": "2026-09-23",
          "inspector_name": "孙验",
          "conclusion": "FAIL",
          "next_deadline": "2026-09-30",
          "created_at": "2026-09-23T14:00:00Z"
        },
        {
          "id": 5,
          "ticket_id": 5,
          "recheck_date": "2026-10-02",
          "inspector_name": "孙验",
          "conclusion": "FAIL",
          "next_deadline": "2026-10-09",
          "created_at": "2026-10-02T14:05:00Z"
        }
      ]
    },
    {
      "id": 6,
      "result_id": 1,
      "device_id": 1,
      "severity": "HIGH",
      "owner_id": 11,
      "deadline": "2026-09-21",
      "rectify_status": "RECHECK_FAILED",
      "rectify_note": "对一层喷淋管网分段打压检漏，更换 3 处密封垫。",
      "closed_at": "",
      "rechecks": [
        {
          "id": 6,
          "ticket_id": 6,
          "recheck_date": "2026-09-27",
          "inspector_name": "周维保",
          "conclusion": "FAIL",
          "next_deadline": "2026-10-08",
          "created_at": "2026-09-27T10:00:00Z"
        }
      ]
    }
  ]
}
