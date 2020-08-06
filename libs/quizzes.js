
export function getQuizzes() {
    return [
        {
            id: 1,
            slug: 'world-cup-winners',
            category: ['Sports'],
            name: 'World Cup Winners',
        },
        {
            id: 2,
            slug: 'the-olymics',
            category: ['Sports'],
            name: 'The Olymics',
        },
        {
            id: 3,
            slug: 'football',
            category: ['Sports'],
            name: 'Football',
        },
        {
            id: 4,
            slug: 'uk-castles',
            category: ['History'],
            name: 'UK Castles',
        },
    ]
}

export function getQuizData(quizSlug) {
    const quizzes = getQuizzes()
    return quizzes.find(q => q.slug == quizSlug)
}