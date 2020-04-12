import React from 'react';
import {StyledButton,ButtonHref,StyledSection,StyledMainDiv,Header,MainImage,StyledHeaderDiv,ShadowLink} from './StyledComps';
import logo from './resources/logo_development.png'
import Recorder from './Recorder';
import Webcam from './Webcam';

export default class MainPage extends React.Component {
    constructor(){
        super();
    }

    render(){
        return (
            <StyledSection>

                <Header>
                &nbsp;
                </Header>
                <Header>
                    <StyledHeaderDiv>
                        <MainImage src={logo}></MainImage>
                        <h3>Emlak Katılım Recorder</h3>
                    </StyledHeaderDiv>
                
                </Header>
                <Header>
                
                </Header>
                

                <nav>&nbsp;</nav>

                <main>
                    <Recorder></Recorder>
                    <Webcam></Webcam>
                </main>

                <side>&nbsp;</side>


                <footer></footer>
                
            </StyledSection>
            
        );
    }
}