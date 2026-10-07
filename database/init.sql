CREATE TABLE IF NOT EXISTS building (
  id INTEGER PRIMARY KEY,
  name TEXT,
  campus TEXT,
  floor_count TEXT,
  fire_grade TEXT,
  manager_id TEXT,
  address_code TEXT
);

CREATE TABLE IF NOT EXISTS fire_device (
  id INTEGER PRIMARY KEY,
  building_id TEXT,
  device_code TEXT,
  device_type TEXT,
  floor TEXT,
  location_desc TEXT,
  install_date TEXT,
  status TEXT,
  next_maintenance_at TEXT
);

CREATE TABLE IF NOT EXISTS inspection_task (
  id INTEGER PRIMARY KEY,
  building_id TEXT,
  inspector_id TEXT,
  plan_date TEXT,
  task_type TEXT,
  status TEXT,
  checklist_version TEXT,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS inspection_result (
  id INTEGER PRIMARY KEY,
  task_id TEXT,
  device_id TEXT,
  item_code TEXT,
  result_status TEXT,
  measured_value TEXT,
  photo_url TEXT,
  note TEXT
);

-- 隐患整改单：rectify_status / closed_at 为以复验结论为准的派生值，落库仅作快照
CREATE TABLE IF NOT EXISTS hazard_ticket (
  id INTEGER PRIMARY KEY,
  result_id TEXT,
  severity TEXT,
  owner_id TEXT,
  owner_name TEXT,
  deadline TEXT,
  rectify_note TEXT,
  rectified_at TEXT,
  closed_at TEXT,
  rectify_status TEXT
);

-- 复验记录：一张隐患单可多次复验，最近一条结论决定整单状态与期限
CREATE TABLE IF NOT EXISTS verification (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER,
  verified_at TEXT,
  inspector TEXT,
  result TEXT,
  note TEXT,
  new_deadline TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);
