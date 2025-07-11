import { useRef } from "react";
import LargeBlueButton from "../../basic/LargeBlueButton/LargeBlueButton";

function QuestionForm({ addQuestion }) {
    const form = useRef(null);

    const handleSendQuestion = () => {
        if (form.current.value.trim() == "") {
            form.current.focus();
            alert("Por favor, ingrese una pregunta.");
            return;
        }
        addQuestion(form.current.value);
        form.current.value = "";
    }

    return (
        <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
            <textarea
                name="question"
                ref={form}
                className="rounded"
                rows="1"
                style={{
                    resize: "vertical",
                    boxShadow: "0px 0px 4px 0px #00000026",
                    width: "100%",
                    fontSize: "1rem",
                    maxHeight: "4.5rem",
                    overflowY: "auto",
                }}
            ></textarea>
            <div style={{ width: "100%", maxWidth: "180px" }}>
                <LargeBlueButton onClick={handleSendQuestion} text={"Preguntar"} />
            </div>
        </div>
    );
}

export default QuestionForm;