CREATE OR REPLACE FUNCTION test_session_answer_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('test_answer_changes', json_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'time', NOW(),
        'data', json_build_object(
            'id', NEW.id,
            'question_id', NEW.question_id,
            'test_session_registered_user_id', NEW.test_session_registered_user_id,
            'value', NEW.value,
            'skipped', NEW.skipped,
            'created_at', NEW.created_at
        )
    )::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER test_session_answer_trigger
AFTER INSERT ON "TestSessionAnswerModel"
FOR EACH ROW EXECUTE FUNCTION test_session_answer_trigger_function();