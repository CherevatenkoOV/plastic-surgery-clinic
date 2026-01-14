-- replaceWeeklySlot
-- Atomically replaces an existing weekly slot with a new one.
--
-- Parameters:
-- $1: doctorId   UUID       – owner of the slot
-- $2: slotId     UUID       – id of the slot to be replaced
-- $3: weekday    INT        – weekday of the new slot (e.g. 1–7)
-- $4: startAt    TIMESTAMP  – start time of the new slot
-- $5: endAt      TIMESTAMP  – end time of the new slot
--
-- Result column:
-- newSlotId UUID | NULL – id of the newly created slot (if any)

WITH old AS (SELECT id
             FROM doctor_weekly_slots
             WHERE doctor_id = $1::uuid
    AND id = $2::uuid
    FOR
UPDATE
    ),
    ins AS (
INSERT
INTO doctor_weekly_slots (doctor_id, weekday, time_range)
SELECT
    $1::uuid, $3:: int, tsrange($4:: timestamp, $5:: timestamp, '[)')
FROM old
    RETURNING id
    ), del AS (
DELETE
FROM doctor_weekly_slots d
    USING ins
WHERE d.doctor_id = $1::uuid
  AND d.id = $2::uuid
    RETURNING 1
    )

SELECT id
FROM ins AS "newSlotId";
