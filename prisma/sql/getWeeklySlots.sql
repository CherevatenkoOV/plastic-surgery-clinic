SELECT id,
       weekday,
       lower(time_range) AS "startAt",
       upper(time_range) AS "endAt"
FROM doctor_weekly_slots
WHERE doctor_id = $1
ORDER BY weekday ASC, "startAt" ASC;


