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
        debugger;
        this.stream = await Recorder._startScreenCapture();

        console.log("strem : ", this.stream);
        //this.setState({stream : this.stream});
        this.stream.addEventListener('inactive', e => {
            console.log('Capture stream inactive - stop recording!');
            this._downloadCapture(e);
          });
          debugger;
        //this.setState({mediaRecorder : new MediaRecorder(this.stream, {mimeType: 'video/webm'})});
        this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});

        console.log("media recorder : ",this.mediaRecorder);
        this.mediaRecorder.addEventListener('dataavailable', event => {
          console.log("event entry : " ,event);
          if (event.data && event.data.size > 0) {
            console.log("event in if : " ,event);
            this.state.chunks.push(event.data);
          }
        });
        this.mediaRecorder.start(10);
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
        debugger;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.mediaRecorder.stop();        
        this.mediaRecorder = null;
        
        
    
        

        
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
                            //display={!this.state.enableStartCapture ? "inherit" : "none"}
                            onClick={e => this._startCapturing(e)}
                            Display={this.state.enableStartCapture}
                            disabled={!this.state.enableStartCapture}
                            id="StartSRCapture"
                        >
                            Ekran Görüntü Kaydı Başlatın
                        </StyledButton>
                        <StyledButton
                            href="https://github.com/styled-components/styled-components"
                            target="_blank"
                            rel="noopener"
                            //display={!this.state.enableDownloadRecording ? "inherit" : "none"}
                            Display={this.state.enableDownloadRecording}
                            disabled={!this.state.enableDownloadRecording}
                            onClick={e => this._stopCapturing(e)}
                            id="StopSRCapture"
                        >
                        Kaydı Durdurun ve İndirin
                        </StyledButton>
                        <ShadowLink id="downloadLink" type="video/webm"></ShadowLink>
                    </StyledMainDiv>
            
        );
    }
}