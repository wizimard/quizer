CREATE OR REPLACE FUNCTION test_session_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('test_session_changes', json_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'time', NOW(),
        'data', json_build_object(
            'id', NEW.id,
            'test_id', NEW.test_id,
            'current_question_id', NEW.current_question_id,
            'finished_at', NEW.finished_at
        )
    )::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER test_session_trigger
AFTER INSERT OR UPDATE ON "TestSessionModel"
FOR EACH ROW EXECUTE FUNCTION test_session_trigger();