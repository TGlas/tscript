import { ErrorHelper } from "../errors/ErrorHelper";
import { TScript } from "..";
import { Typeid } from "../helpers/typeIds";
import { tscript_audio } from "./lib-audio.tscript";

export const lib_audio = {
    source: tscript_audio,
    "impl": {
        "audio":{
            "MonoAudio":{
                "constructor":function(object, buffer, sampleRate){
                    if (! TScript.isDerivedFrom(buffer.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["buffer", "audio.MonoAudio.constructor", "array", TScript.displayname(buffer)]);
                    
                    if(! TScript.isDerivedFrom(sampleRate.type, Typeid.typeid_integer)) ErrorHelper.error("/argument-mismatch/am-1", ["sampleRate", "audio.MonoAudio.constructor", "integer", TScript.displayname(sampleRate)])	
                                
                    if(!checkAudioBufferCorrectness(buffer))ErrorHelper.error("/argument-mismatch/am-44", ["buffer", "real"]);


                    if(!hasAudioContext.call(this)) return;
                    let buf = this.service.audioContext.createBuffer(1, buffer.value.b.length, sampleRate.value.b);
                    
                    fillAudioBuffer(buffer, buf.getChannelData(0));

                    let sourceNode = this.service.audioContext.createBufferSource();
                    sourceNode.buffer = buf;
                    sourceNode.connect(this.service.audioContext.destination);

                    
                    object.value.b = sourceNode;
                },
                "play": function(object)
                {	
                    if(!hasAudioContext.call(this)) return;
                    object.value.b.start()	
                },	
                "pause": function(object)
                {	
                    if(!hasAudioContext.call(this)) return;
                    object.value.b.stop()	
                },		
                "setPlaybackRate":function(object, speed)
                {	
                    if(! TScript.isDerivedFrom(speed.type, Typeid.typeid_real)) ErrorHelper.error("/argument-mismatch/am-1", ["speed", "audio.MonoAudio.setPlaybackRate", "real", TScript.displayname(speed)])	
                    if(!hasAudioContext.call(this)) return;
                    object.value.b.playbackRate.value = speed.value.b;	
                }
            },
            "StereoAudio":{
                "constructor":function(object, leftBuffer, rightBuffer, sampleRate){
                    if (! TScript.isDerivedFrom(leftBuffer.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["leftBuffer", "audio.StereoAudio.constructor", "array", TScript.displayname(leftBuffer)]);
                    if (! TScript.isDerivedFrom(rightBuffer.type, Typeid.typeid_array)) ErrorHelper.error("/argument-mismatch/am-1", ["rightBuffer", "audio.StereoAudio.constructor", "array", TScript.displayname(rightBuffer)]);

                    if(! TScript.isDerivedFrom(sampleRate.type, Typeid.typeid_integer)) ErrorHelper.error("/argument-mismatch/am-1", ["sampleRate", "audio.StereoAudio.constructor", "integer", TScript.displayname(sampleRate)])	
                    
                    if(!checkAudioBufferCorrectness(rightBuffer)) ErrorHelper.error("/argument-mismatch/am-44", ["rightBuffer", "real"]);
                

                    if(!checkAudioBufferCorrectness(leftBuffer)) ErrorHelper.error("/argument-mismatch/am-44", ["leftBuffer", "real"]);


                    if(!hasAudioContext.call(this)) return;
                    let buf = this.service.audioContext.createBuffer(2, leftBuffer.value.b.length, sampleRate.value.b);

                    fillAudioBuffer(leftBuffer, buf.getChannelData(0));
                    fillAudioBuffer(rightBuffer, buf.getChannelData(1));

                    let sourceNode = this.service.audioContext.createBufferSource();
                    sourceNode.buffer = buf;
                    sourceNode.connect(this.service.audioContext.destination);

                    object.value.b = sourceNode;
                },

                "play": function(object)
                {	
                    if(!hasAudioContext.call(this)) return;
                    object.value.b.start()	
                },	
                "pause": function(object)
                {
                    if(!hasAudioContext.call(this)) return;	
                    object.value.b.stop()	
                },		
                "setPlaybackRate":function(object, speed){	
                    if(! TScript.isDerivedFrom(speed.type, Typeid.typeid_real)) ErrorHelper.error("/argument-mismatch/am-1", ["speed", "audio.StereoAudio.setPlaybackRate", "real", TScript.displayname(speed)])	
                    if(!hasAudioContext.call(this)) return;

                    object.value.b.playbackRate.value = speed.value.b;	
                }
            },
        }
    },
}

//moves data from a tscript array of reals into a Float32 array returns false if the buffer contained invalid data
let fillAudioBuffer = function(tscriptBuffer, array){
    function clamp(v, min, max)
    { return v > max ? max : (v < min) ? min : v; } 
    
    for(let i=0; i < array.length; i++){
        //clip sample to [-1,1]
        array[i] = clamp(tscriptBuffer.value.b[i].value.b, -1, 1);;
    }
}

// returns false if the buffer contains invalid data.
let checkAudioBufferCorrectness = function(tscriptBuffer){
    for(let i=0; i < tscriptBuffer.value.b.length; i++){
        //check if number is a real
        if (! TScript.isDerivedFrom(tscriptBuffer.value.b[i].type, Typeid.typeid_real)) return false;
    }
    return true;
}

function hasAudioContext(){
    if(typeof this.service.audioContext === 'undefined') return false;
    if(this.service.audioContext  === null) return false;
    return true;
}