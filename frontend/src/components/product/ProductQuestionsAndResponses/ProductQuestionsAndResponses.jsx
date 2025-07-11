import avatarPlaceholder from '../../../assets/ui/profile-placeholder.png';

function ProductQuestionsAndResponses({questions}) {
    return (
        <>
            <h5 className='mb-4'>Ultimas preguntas</h5>
            <div className={"d-flex flex-column gap-3"}>
                {questions && questions?.length > 0 ?
                    questions.map((question) => (
                        <div className="mx-4">
                            <div className={`d-flex align-items-center gap-2`} key={question?.id}>
                                <img src={avatarPlaceholder} className="rounded-circle object-fit-contain" width={30}/>
                                <span>{question.by}</span>
                            </div>
                            <p className={`mt-2`} index={question?.id}>{question?.comment}</p>
                        </div>
                    ))
                    :
                    <p className="text-center text-secondary py-5">Este producto no tiene preguntas</p>
                }
            </div>
        </>

    );
}

export default ProductQuestionsAndResponses;