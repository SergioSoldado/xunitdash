export interface Skipped {
  id: string
  test_case_id: number
  Type: string
  message: string
  Value: string
}

export interface Error {
  id: string
  test_case_id: number
  type: string
  message: string
  Value: string
}

export interface Failure {
  id: string
  test_case_id: number
  type: string
  message: string
  Value: string
}

export interface RerunFailure {
  id: string
  test_case_id: number
  Type: string
  message: string
  value: string
  stack_trace: string
  system_out: string
  system_err: string
}

export interface RerunError {
  id: string
  test_case_id: number
  Type: string
  message: string
  value: string
  stack_trace: string
  system_out: string
  system_err: string
}

export interface FlakyFailure {
  id: string
  test_case_id: number
  Type: string
  message: string
  value: string
  stack_trace: string
  system_out: string
  system_err: string
}

export interface FlakyError {
  id: string
  test_case_id: number
  Type: string
  message: string
  value: string
  stack_trace: string
  system_out: string
  system_err: string
}

export interface TestCaseStatic {
  id: string
  name: string
  description: string
  classname?: string
  group?: string
  file?: string
  line?: number
}

export interface TestCase {
  id: string
  test_case_static_id: number
  test_suite_id: number
  time: number
  properties: object
  system_out: string
  system_err: string
  skips?: Array<Skipped>
  errors?: Array<Error>
  failures?: Array<Failure>
  rerun_failures?: Array<RerunFailure>
  rerun_errors?: Array<RerunError>
  flaky_failures?: Array<FlakyFailure>
  flaky_errors?: Array<FlakyError>
  testCaseStatic?: TestCaseStatic
  test_suite?: TestSuiteType
}

export interface TestSuiteStatic {
  id: string
  name: string
  description?: string
  package?: string
  group?: string
  file?: string
  log?: string
  version?: string
  testCases: Array<TestCaseStatic>
}

export interface TestSuiteType {
  id: number
  test_suite_static_id: number
  test_run_id: number
  tests?: number
  failures?: number
  errors?: number
  skipped?: number
  time?: number
  timestamp?: string
  hostname?: string
  url?: string
  properties?: object
  system_out?: string
  system_err?: string
  testSuiteStatic?: TestSuiteStatic
  testCases?: Array<TestCase>
}

export interface TestRunData {
  id: string
  name?: string
  tests?: number
  errors?: number
  failures?: number
  skipped?: number
  meta?: object
  time?: string
  timestamp?: string
  detailUrl?: string
  testSuites?: Array<TestSuiteType>
}

export interface GenericRunData {
  id?: string
  tests?: number
  errors?: number
  failures?: number
  skipped?: number
  timestamp?: string
}
