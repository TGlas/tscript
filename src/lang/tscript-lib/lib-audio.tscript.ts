export const tscript_audio = `
namespace audio{
	class MonoSound
	{
		public:
		constructor(buffer, sampleRate){}
		function play(){}
		function startLoop(){}
		function stopLoop(){}
		function looping(){}
	}
	class StereoSound
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
