declare module sss {
  function init(_seed?: number, tempo?: number, fps?: number);
  function play(name?: string, mult?: number, params? :any);
  function setVolume(volume: number);
  function setQuantize(_quantize: number);
  function playBgm(name?: string, interval?: number, params?: any);
  function stopBgm();
  function update();
  function reset();
  function playEmpty();
  function playParam(param: any);
  const Preset;
}
