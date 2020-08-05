
export function getQuizzes() {
    return [
        {
            id: 1,
            category: ['Sports'],
            name: 'World Cup Winners',
        },
        {
            id: 2,
            category: ['Sports'],
            name: 'The Olymics',
        },
        {
            id: 3,
            category: ['Sports'],
            name: 'Football',
        },
        {
            id: 4,
            category: ['History'],
            name: 'UK Castles',
        },
    ]
}

export function getQuizData(quizId) {
    const quizzes = getQuizzes()
    return quizzes.find(q => q.id == quizId)
}