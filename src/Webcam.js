import React from 'react';
import {StyledButton,ButtonHref,StyledSection,StyledMainDiv,Header,MainImage,StyledHeaderDiv,ShadowLink} from './StyledComps';


export default class Webcam extends React.Component {
    constructor(){
        super();
        this.state={
            enableStartWebCapture : true,
            enableDownloadRecording : false,
            webStream : null,
            chunks : [],
            mediaRecorder : null,
            status : 'Inactive',
            recording : null,
            sourceBuffer : null,
            options: null,
            recordedBlobs: []
        }
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
        this.state.webStream = await navigator.mediaDevices.getUserMedia(constraints);

      

      debugger;
        console.log('getUserMedia() got stream:', this.state.webStream);
        //window.stream = this.state.webStream;

        try {
            this.mediaRecorder = new MediaRecorder( this.state.webStream, this.state.options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }
        


        console.log('Created MediaRecorder', this.state.mediaRecorder, 'with options', this.state.options);
        this.setState({enableDownloadRecording : true , enableStartWebCapture: false});
        this.mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobss);
        };
        this.mediaRecorder.ondataavailable = (event) => {
          console.log('handleDataAvailable', event);
          if (event.data && event.data.size > 0) {
            recordedBlobss.push(event.data);
          }
          this.setState({recordedBlobs:recordedBlobss});
        };
        this.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.mediaRecorder);
      }

      _stopCapturing(e) {
        //this.afterManualStop();

        this.setState({enableDownloadRecording : false , enableStartWebCapture: true});
        this.state.webStream.getTracks().forEach(track => track.stop());
        this.mediaRecorder.stop();

        this._downloadCapture();

        
      }
      /*handleSourceOpen(event) {
        console.log('MediaSource opened');
        this.state.sourceBuffer = this.state.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', this.state.sourceBuffer);
      }*/
      
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
                            Display={this.state.enableStartWebCapture}
                            disabled={!this.state.enableStartWebCapture}
                            onClick={e => this._startCapturing(e)}
                            id="StartWRCapture"
                        >
                            Webcam kaydı başlatın
                        </StyledButton>
                        <StyledButton
                            href="https://github.com/styled-components/styled-components"
                            target="_blank"
                            rel="noopener"
                            Display={this.state.enableDownloadRecording}
                            disabled={!this.state.enableDownloadRecording}
                            onClick={e => this._stopCapturing(e)}
                            id="StopWRCapture"
                            
                        >
                        Kaydı Durdurun ve İndirin
                        </StyledButton>
                        <ShadowLink id="downloadLink" type="video/webm"></ShadowLink>
                    </StyledMainDiv>
            
        );
    }
}