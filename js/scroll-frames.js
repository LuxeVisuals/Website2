(function(){
  var FRAME_COUNT = 60;
  var BASE = 'Frames/ezgif-frame-';
  var frames = [];
  var loaded = 0;
  var canvas = document.getElementById('scroll-bg-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var currentFrame = 0;
  var rafPending = false;

  function pad(n){ return String(n).padStart(3,'0'); }

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrame);
  }

  function drawFrame(idx){
    var img = frames[idx];
    if(!img || !img.complete || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var scale = Math.max(cw/iw, ch/ih);
    var dw = iw*scale, dh = ih*scale;
    var dx = (cw-dw)/2, dy = (ch-dh)/2;
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(img,dx,dy,dw,dh);
  }

  function onScroll(){
    if(rafPending) return;
    rafPending = true;
    requestAnimationFrame(function(){
      rafPending = false;
      var maxScroll = document.body.scrollHeight - window.innerHeight;
      var progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      var idx = Math.round(progress * (FRAME_COUNT-1));
      if(idx !== currentFrame){
        currentFrame = idx;
        drawFrame(currentFrame);
      }
    });
  }

  for(var i=1; i<=FRAME_COUNT; i++){
    (function(idx){
      var img = new Image();
      img.onload = function(){
        loaded++;
        if(idx-1 === 0) drawFrame(0);
      };
      img.src = BASE + pad(idx) + '.jpg';
      frames[idx-1] = img;
    })(i);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', resize);
  resize();
})();
