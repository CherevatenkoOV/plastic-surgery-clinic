-- insertWeeklySlots
-- Inserts multiple weekly slots for a doctor from a JSONB payload, ignoring duplicates.
--
-- Parameters:
-- $1: doctorId   UUID   – owner of the slots
-- $2: slotsJson  JSONB  – object with field "slots": array of slot objects
--                         Each slot object:
--                           weekday INT – weekday of the slot (e.g. 1–7)
--                           startAt TIMESTAMP – slot start time
--                           endAt TIMESTAMP – slot end time
--
-- Result columns:
-- inputCount INT – total number of slots provided in input
-- insertedCount INT – number of slots actually inserted
-- skippedCount INT – number of slots skipped due to conflicts (already existing)


WITH input AS (SELECT *
               FROM jsonb_to_recordset(($2::jsonb) -> 'slots') AS x(
                                                                     weekday int,
                                                                     "startAt" text,
                                                                     "endAt" text
                   )),
     ins AS (
INSERT
INTO doctor_weekly_slots (doctor_id, weekday, time_range)
SELECT $1::uuid AS doctor_id, i.weekday,
       tsrange(i."startAt"::timestamp, i."endAt"::timestamp, '[)')
FROM input i ON CONFLICT (doctor_id, weekday, time_range) DO NOTHING
  RETURNING 1
)
SELECT (SELECT COUNT(*) ::int FROM input) AS "inputCount",
       (SELECT COUNT(*) ::int FROM ins)   AS "insertedCount",
       (SELECT COUNT(*) FROM input) - (SELECT COUNT(*) FROM ins) ::int AS "skippedCount";
