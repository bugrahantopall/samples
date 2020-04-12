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
            sourceBuffer : null
        }

        this.state.mediaSource.addEventListener('sourceopen', this.handleSourceOpen, false);
    }

    async _startCapturing(e) {
        this.recordedBlobs = [];
        let options = {mimeType: 'video/webm;codecs=vp9'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            options = {mimeType: 'video/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                options = {mimeType: ''};
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

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log('getUserMedia() got stream:', stream);
        window.stream = stream;

        try {
            this.state.mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        


        console.log('Created MediaRecorder', this.state.mediaRecorder, 'with options', options);
        this.setState({enableDownloadRecording : true , enableStartCapture: false});
        this.state.mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', this.recordedBlobs);
        };
        this.state.mediaRecorder.ondataavailable = this.handleDataAvailable;
        this.state.mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', this.state.mediaRecorder);
      }

      _stopCapturing(e) {

        this.setState({enableDownloadRecording : true , enableStartCapture: false});
        this.state.mediaRecorder.stop();

        this._downloadCapture();

        
      }

      handleSourceOpen(event) {
        console.log('MediaSource opened');
        this.state.sourceBuffer = this.state.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', this.state.sourceBuffer);
      }
      
      handleDataAvailable(event) {
        console.log('handleDataAvailable', event);
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      }

      _downloadCapture(){


        let blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
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
                            disabled={!this.state.enableStartCapture}
                            onClick={e => this._startCapturing(e)}
                        >
                            Webcam kaydı başlatın
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