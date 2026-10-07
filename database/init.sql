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

CREATE TABLE IF NOT EXISTS hazard_ticket (
  id INTEGER PRIMARY KEY,
  result_id TEXT,
  severity TEXT,
  owner_id TEXT,
  deadline TEXT,
  rectify_status TEXT,
  rectify_note TEXT,
  closed_at TEXT
);

-- 隐患单复验记录：一张隐患单可多次复验，结论驱动整改状态/期限
CREATE TABLE IF NOT EXISTS hazard_recheck (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  recheck_date TEXT NOT NULL,
  inspector_name TEXT NOT NULL,
  conclusion TEXT NOT NULL,
  next_deadline TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);
