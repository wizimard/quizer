CREATE OR REPLACE FUNCTION test_session_registered_user_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_test_id TEXT;
BEGIN
    SELECT ts.test_id INTO v_test_id
    FROM "TestSessionModel" ts
    WHERE ts.id = NEW.test_session_id;

    PERFORM pg_notify('test_registration_changes', json_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'time', NOW(),
        'data', json_build_object(
            'id', NEW.id,
            'test_session_id', NEW.test_session_id,
            'test_id', v_test_id,
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'created_at', NEW.created_at
        )
    )::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
