import React from 'react';
import {StyledButton,ButtonHref,StyledSection,StyledMainDiv,Header,MainImage,StyledHeaderDiv,ShadowLink} from './StyledComps';
import logo from './resources/logo_development.png'


export default class Recorder extends React.Component {
    constructor(){
        super();
        this.state={
            enableStartCapture : true,
            enableDownloadRecording : false,
            stream : null,
            chunks : [],
            mediaRecorder : null,
            status : 'Inactive',
            recording : null
        }
    }

    async _startCapturing(e) {
        console.log('Start capturing.');
        this.setState({status : 'Screen recording started.'});
        this.setState({enableStartCapture : false});
        this.setState({enableDownloadRecording : true});
        //this.requestUpdate('buttons');
        
    
        if (this.recording) {
            window.URL.revokeObjectURL(this.recording);
        }
    
        this.setState({chunks : []});
        this.setState({recording : null});
        this.stream = await Recorder._startScreenCapture();
        //this.setState({stream : this.stream});
        this.stream.addEventListener('inactive', e => {
            console.log('Capture stream inactive - stop recording!');
            this._downloadCapture(e);
          });
        this.setState({mediaRecorder : new MediaRecorder(this.stream, {mimeType: 'video/webm'})});
        this.state.mediaRecorder.addEventListener('dataavailable', event => {
          if (event.data && event.data.size > 0) {
            this.state.chunks.push(event.data);
          }
        });
        this.state.mediaRecorder.start(10);
      }

    static _startScreenCapture() {
        if (navigator.getDisplayMedia) {
          return navigator.getDisplayMedia({video: {mediaSource: 'screen'}});
        } else if (navigator.mediaDevices.getDisplayMedia) {
          return navigator.mediaDevices.getDisplayMedia({video: {mediaSource: 'screen'}});
        } else {
          return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
        }
      }

      _stopCapturing(e) {
        console.log('Stop capturing.');
        

        this.setState({status : 'Screen recorded completed.'});
        this.setState({enableStartCapture : true});
        this.setState({enableDownloadRecording : false});
    
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.state.mediaRecorder.stop();        
        this.state.mediaRecorder = null;
        
        
    
        

        
      }

      _downloadCapture(e){
        this.setState({recording : window.URL.createObjectURL(new Blob(this.state.chunks, {type: 'video/webm'}))});

        console.log('Download recording.');
        this.setState({enableStartCapture : true});
        this.setState({enableDownloadRecording : false});

        const downloadLink = document.querySelector('a#downloadLink');
        downloadLink.addEventListener('progress', e => console.log(e));
        downloadLink.href = this.state.recording;
        downloadLink.download = 'screen-recording.webm';
        downloadLink.click();
      }

      
    render(){
        return (
            
                    <StyledMainDiv>
                        <StyledButton 
                            disabled={!this.state.enableStartCapture}
                            onClick={e => this._startCapturing(e)}
                        >
                            Ekran Görüntü Kaydı Başlatın
                        </StyledButton>
                        <StyledButton
                            href="https://github.com/styled-components/styled-components"
                            target="_blank"
                            rel="noopener"
                            disabled={!this.state.enableDownloadRecording}
                            onClick={e => this._stopCapturing(e)}
                        >
                        Kaydı İndirin
                        </StyledButton>
                        <ShadowLink id="downloadLink" type="video/webm"></ShadowLink>
                    </StyledMainDiv>
            
        );
    }
}