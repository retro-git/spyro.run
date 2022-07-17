var React = require('react');
import styled, { css } from 'styled-components'
import Moneybags from "../assets/images/moneybags.svg"

const Content = styled.div`
    background-color: black;
    text-align: center;
    position: fixed; 
    top: 0; 
    left: 0; 

    /* Preserve aspet ratio */
    min-width: 100%;
    min-height: 100%;
`;

const BackgroundImage = styled.div`
    background: transparent url(${Moneybags});
    background-color: transparent;
    position: fixed; 
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    top: 0; 
    left: 0; 
    opacity: 0;
    z-index: 1;

    /* Preserve aspet ratio */
    min-width: 100%;
    min-height: 100%;
    
    animation: fade-in-background 2s;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
    animation-delay: 0.6s;
    animation-fill-mode: forwards;

    @keyframes fade-in-background {
        0% { opacity: 0; }
        100% { opacity: 0.5; }
    }

    /* &:hover {
        background-color: red; // <Thing> when hovered
    } */
`;

const Message = styled.p`
    color: #f11d6e;
	text-align: center;
	font-family: monospace;
    font-size: ${props => props.title ? "70px" : "35px"};
    padding-top: ${props => props.title ? "45px" : "0px"};
    padding-bottom: ${props => props.title ? "10px" : "0px"};
    margin: 0px;
    opacity: 100%;
    z-index: 2;
    position: relative;

    animation: fade-in-message 0.5s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;

    @keyframes fade-in-message {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

const Enter = styled.p`
    color: #f11d6e;
	text-align: center;
	font-family: monospace;
    font-size: 30px;
    opacity: 0%;
    z-index: 2;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-150%);

    animation: fade-in-message 1s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: 5s;

    @keyframes fade-in-message {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

export class Home extends React.Component {
    constructor(props) {
        super(props);

        document.addEventListener('click', this.handleClick.bind(this));
        document.body.style.cursor = 'pointer';
    }
    state = {}

    handleClick(e) {
        window.location.href = '/boards.html'
    }

    render() {
        return (
            <Content>
                <Message title={true}>
                    spyro.run
                </Message>
                <BackgroundImage />
            </Content>
        );
    }
    /*render() {
        return (
            <Content>
                <Canvas></Canvas>
                <BackgroundImage></BackgroundImage>
            </Content>
        )
    }*/
}

class Canvas extends React.Component {
    constructor(props) {
        super(props);

        window.addEventListener('resize', this.handleResize.bind(this));
    }
    state = {
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight
    }

    canvasRef = React.createRef();

    drawCanvas() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
        //ctx.drawImage(Moneybags, this.state.canvasWidth, this.state.canvasHeight);
        var img = document.createElement('img');
        img.src = Moneybags;
        img.onload = () => {
            let w = 630;
            let h = 980;
            //ctx.drawImage(img, this.state.canvasWidth / 2 - img.width / 2, this.state.canvasHeight / 2 - img.height / 2);
            console.log(img.width);
            console.log(img.height);
            console.log(this.state.canvasWidth);
            console.log(this.state.canvasHeight);
            ctx.drawImage(img, this.state.canvasWidth / 2 - w / 2, 0);
        }
    }

    handleResize() {
        this.setState({
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight
        })
    }

    componentDidMount() {
        this.drawCanvas();
    }

    componentDidUpdate() {
        this.drawCanvas();
    }

    render() {
        return (
            <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight}/>
        );
    }
}