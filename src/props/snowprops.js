export const systemProp = {
  id: "sys_id",
  created: "sys_created_on",
  createdBy: "sys_created_by",
  modified:"sys_updated_on",
  modifiedBy: "sys_updated_by",
  modificationCount: "sys_mod_count",
}

export const caseProp = {
  table: 'sn_customerservice_case',
  assignedTo: 'assigned_to',
  assignmentGroup: 'assignment_group',
  state: 'state',
  priority: 'priority',
  baseImportance: 'x_admso_assignlist_base_importance'
}

export const caseStates = {
  new: 1,
  open: 10,
  hold: 18,
  closed: 3,
  cancelled: 7
}

export const casePriorities = {
  P1: 1,
  P2: 2,
  P3: 3,
  P4: 4,
  P5: 5
}

export const caseGroups = {
  nocEven: "cf7fc90bdb51df40b5b7d2984b96193b",
  nocOdd: "874a9505db121700d3f336be3b9619be",
  nocVector: "8e01defedb802b0066cf8d37489619ac",
  nocVoice: "f30b367bdbfae70066cf8d374896197a",
  nocWhiteGlove: "3e3502cadb47d3808648d2984b961974",
  engineering: "c0cd0b98dbb01700749a36be3b9619c5",
  serviceManagement: "dba7c02bdba75304d3f336be3b9619b4",
}
export const nocGroupList = [
  caseGroups.nocEven,
  caseGroups.nocOdd,
  caseGroups.nocVector,
  caseGroups.nocVoice,
  caseGroups.nocWhiteGlove
]

export const slaProp = {
  table: 'task_sla',
  active: 'active',
  task: 'task',
  percentage: 'percentage',
  bPercentage: 'business_percentage'
}
