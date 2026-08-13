CREATE OR REPLACE FUNCTION test_session_answer_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_test_id TEXT;
BEGIN
    SELECT ts.test_id INTO v_test_id
    FROM "TestSessionRegisteredUserModel" ru
    JOIN "TestSessionModel" ts ON ts.id = ru.test_session_id
    WHERE ru.id = NEW.test_session_registered_user_id;

    PERFORM pg_notify('test_answer_changes', json_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'time', NOW(),
        'data', json_build_object(
            'id', NEW.id,
            'question_id', NEW."questionId",
            'test_session_registered_user_id', NEW.test_session_registered_user_id,
            'test_id', v_test_id,
            'value', NEW.value,
            'skipped', NEW.skipped,
            'created_at', NEW.created_at
        )
    )::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
