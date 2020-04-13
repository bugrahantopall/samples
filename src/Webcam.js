import React from 'react';
import {StyledButton,ButtonHref,StyledSection,StyledMainDiv,Header,MainImage,StyledHeaderDiv,ShadowLink} from './StyledComps';


export default class Webcam extends React.Component {
    constructor(){
        super();
        this.state={
            enableStartCapture : true,
            enableDownloadRecording : false,
            stream : null,
            chunks : [],
            mediaRecorder : null,
            status : 'Inactive',
            recording : null,
            mediaSource : new MediaSource(),
            sourceBuffer : null,
            options: null,
            recordedBlobs: []
        }
        this.state.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
    }

    async _startCapturing(e) {
        let recordedBlobss = [];
        this.state.options = {mimeType: 'video/webm;codecs=vp9'};
        if (!MediaRecorder.isTypeSupported(this.state.options.mimeType)) {
            console.error(`${this.state.options.mimeType} is not Supported`);
            this.state.options = {mimeType: 'video/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(this.state.options.mimeType)) {
            console.error(`${this.state.options.mimeType} is not Supported`);
            this.state.options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(this.state.options.mimeType)) {
                console.error(`${this.state.options.mimeType} is not Supported`);
                this.state.options = {mimeType: ''};
            }
            }
        }

        const constraints = {
            audio: {
              echoCancellation: {exact: true}
            },
            video: {
              width: 1280, height: 720
            }
          };
        this.state.stream = await navigator.mediaDevices.getUserMedia(constraints);

      

      
        console.log('getUserMedia() got stream:', this.state.stream);
        window.stream = this.state.stream;

        try {
            this.state.mediaRecorder = new MediaRecorder(window.stream, this.state.options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }
        


        console.log('Created MediaRecorder', this.state.mediaRecorder, 'with options', this.state.options);
        this.setState({enableDownloadRecording : true , enableStartCapture: false});
        this.state.mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobss);
        };
        this.state.mediaRecorder.ondataavailable = (event) => {
          console.log('handleDataAvailable', event);
          if (event.data && event.data.size > 0) {
            recordedBlobss.push(event.data);
          }
          this.setState({recordedBlobs:recordedBlobss});
        };
        this.state.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.state.mediaRecorder);
      }

      async _stopCapturing(e) {
        //this.afterManualStop();

        this.setState({enableDownloadRecording : false , enableStartCapture: true});
        this.state.mediaRecorder.stop();

        this._downloadCapture();

        
      }
      handleSourceOpen(event) {
        console.log('MediaSource opened');
        this.state.sourceBuffer = this.state.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', this.state.sourceBuffer);
      }
      
      handleDataAvailable(event) {
        
      }

      _downloadCapture(){


        let blob = new Blob(this.state.recordedBlobs, {type: 'video/webm'});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
      }

      
    render(){
        return (
            
                    <StyledMainDiv>
                        <StyledButton 
                            display={!this.state.enableStartCapture ? "inherit" : "none"}
                            Display={this.state.enableStartCapture}
                            onClick={e => this._startCapturing(e)}
                        >
                            Webcam kaydı başlatın
                        </StyledButton>
                        <StyledButton
                            href="https://github.com/styled-components/styled-components"
                            target="_blank"
                            rel="noopener"
                            display={!this.state.enableDownloadRecording ? "inherit" : "none"}
                            Display={this.state.enableDownloadRecording}
                            onClick={e => this._stopCapturing(e)}
                        >
                        Kaydı Durdurun ve İndirin
                        </StyledButton>
                        <ShadowLink id="downloadLink" type="video/webm"></ShadowLink>
                    </StyledMainDiv>
            
        );
    }
}