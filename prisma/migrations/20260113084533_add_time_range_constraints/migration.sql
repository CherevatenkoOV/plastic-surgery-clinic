-- This is an empty migration.

ALTER TABLE "doctor_weekly_slots"
    ADD CONSTRAINT "doctor_weekly_slots_time_range_not_infinitive"
        CHECK (
            NOT lower_inf("time_range")
                AND NOT upper_inf("time_range")
            );

ALTER TABLE "doctor_weekly_slots"
    ADD CONSTRAINT "doctor_weekly_slots_time_range_valid"
        CHECK(lower("time_range") < upper("time_range"));