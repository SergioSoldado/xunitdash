CREATE TABLE "TestRun" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "timestamp" timestamp NOT NULL,
  "time" decimal NOT NULL,
  "tests" int NOT NULL,
  "failures" int NOT NULL,
  "errors" int NOT NULL,
  "skipped" int NOT NULL,
  "meta" JSONB
);

CREATE TABLE "TestSuiteStatic" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "description" varchar,
  "package" varchar,
  "group" varchar,
  "file" varchar,
  "log" varchar,
  "version" varchar
);

CREATE TABLE "TestSuite" (
  "id" SERIAL PRIMARY KEY,
  "test_suite_static_id" int,
  "test_run_id" int,
  "tests" int NOT NULL,
  "failures" int NOT NULL,
  "errors" int NOT NULL,
  "skipped" int NOT NULL,
  "time" decimal NOT NULL,
  "timestamp" timestamp NOT NULL,
  "hostname" varchar NOT NULL,
  "url" varchar,
  "properties" JSONB,
  "system_out" varchar,
  "system_err" varchar
);

CREATE TABLE "TestCaseStatic" (
  "id" SERIAL PRIMARY KEY,
  "test_suite_static_id" int,
  "name" varchar NOT NULL,
  "classname" varchar NOT NULL,
  "description" varchar,
  "group" varchar,
  "file" varchar,
  "line" int
);

CREATE TABLE "TestCase" (
  "id" SERIAL PRIMARY KEY,
  "test_case_static_id" int,
  "test_suite_id" int,
  "time" decimal NOT NULL,
  "properties" JSONB,
  "system_out" varchar,
  "system_err" varchar
);

CREATE TABLE "Skipped" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar,
  "message" varchar,
  "value" varchar
);

CREATE TABLE "Error" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar,
  "message" varchar,
  "value" varchar
);

CREATE TABLE "Failure" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar,
  "message" varchar,
  "value" varchar
);

CREATE TABLE "RerunFailure" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar NOT NULL,
  "message" varchar,
  "value" varchar,
  "stack_trace" varchar,
  "system_out" varchar,
  "system_err" varchar
);

CREATE TABLE "RerunError" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar NOT NULL,
  "message" varchar,
  "value" varchar,
  "stack_trace" varchar,
  "system_out" varchar,
  "system_err" varchar
);

CREATE TABLE "FlakyFailure" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar NOT NULL,
  "message" varchar,
  "value" varchar,
  "stack_trace" varchar,
  "system_out" varchar,
  "system_err" varchar
);

CREATE TABLE "FlakyError" (
  "id" SERIAL PRIMARY KEY,
  "test_case_id" int,
  "type" varchar NOT NULL,
  "message" varchar,
  "value" varchar,
  "stack_trace" varchar,
  "system_out" varchar,
  "system_err" varchar
);

ALTER TABLE "TestSuite" ADD FOREIGN KEY ("test_suite_static_id") REFERENCES "TestSuiteStatic" ("id");

ALTER TABLE "TestSuite" ADD FOREIGN KEY ("test_run_id") REFERENCES "TestRun" ("id");

ALTER TABLE "TestCaseStatic" ADD FOREIGN KEY ("test_suite_static_id") REFERENCES "TestSuiteStatic" ("id");

ALTER TABLE "TestCase" ADD FOREIGN KEY ("test_case_static_id") REFERENCES "TestCaseStatic" ("id");

ALTER TABLE "TestCase" ADD FOREIGN KEY ("test_suite_id") REFERENCES "TestSuite" ("id");

ALTER TABLE "Skipped" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");

ALTER TABLE "Error" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");

ALTER TABLE "Failure" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");

ALTER TABLE "RerunFailure" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");

ALTER TABLE "RerunError" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");

ALTER TABLE "FlakyFailure" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");

ALTER TABLE "FlakyError" ADD FOREIGN KEY ("test_case_id") REFERENCES "TestCase" ("id");
