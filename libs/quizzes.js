

export function getQuizData(quizSlug) {
    const quizzes = getQuizzes()
    return quizzes.find(q => q.slug == quizSlug)
}