import { Component } from 'react'
import buttonStyles from '../styles/buttons.module.css'

export default class QuizClient extends Component {

    constructor(props){
        super(props)
        this.handleAnswerClick = this.handleAnswerClick.bind(this)
        
    }

    handleAnswerClick() {
        ws.send('Hello world????');
    }

    componentDidMount() {
        const ws = new WebSocket('ws://localhost:2022')
    }

    render(){
        return (
            <div>
                <h1>Title</h1>
                <h3>Question 1</h3>
                <h5>What is the point of this app?</h5>
                <button onClick={this.handleAnswerClick} className={buttonStyles.button}>Answer 1</button>
                <br/>
                <br/>
                <button onClick={this.handleAnswerClick} className={buttonStyles.button}>Answer 2</button>
            </div>
        )
    }
}