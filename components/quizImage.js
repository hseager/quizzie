import Image from 'next/image'

const QuizImage = function({ src, width, height }) {

    const defaultImage = '/img/quiz/default-image.png';
    src = src ? src : defaultImage

    return (
        <Image src={src} width={width} height={height} />
    )
}

export default QuizImage