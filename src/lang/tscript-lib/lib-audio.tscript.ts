export const tscript_audio = `
namespace audio{
	class MonoAudio
	{
		public:
		constructor(buffer, sampleRate){}
		function play(){}
		function startLoop(){}
		function stopLoop(){}
		function looping(){}
	}
	class StereoAudio
	{
		public:
		constructor(leftBuffer, rightBuffer, sampleRate){}
		function play(){}
		function startLoop(){}
		function stopLoop(){}
		function looping(){}
	}
}
`;
