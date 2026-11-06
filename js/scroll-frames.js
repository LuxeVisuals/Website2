(function(){
  "use strict";
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
    var dpr = window.devicePixelRatio || 1;
    // Set actual canvas drawing buffer size
    canvas.width = Math.round(window.innerWidth * Math.min(dpr, 2));
    canvas.height = Math.round(window.innerHeight * Math.min(dpr, 2));
    drawFrame(currentFrame);
  }

  function drawFrame(idx){
    var img = frames[idx];
    if(!img || !img.complete || !img.naturalWidth) return;
    var cw = canvas.width, ch = canvas.height;
    var iw = img.naturalWidth, ih = img.naturalHeight;

    ctx.save();
    // Fill background with exact deep color of frame edges
    ctx.fillStyle = '#0a0d13';
    ctx.fillRect(0, 0, cw, ch);

    // Make the car brighter and easier to see
    ctx.filter = 'brightness(1.32) contrast(1.06)';

    // Responsive aspect ratio adjustment for mobile vs desktop
    var isPortrait = cw < ch;
    var scale, dw, dh, dx, dy;

    if (isPortrait) {
      // On mobile portrait, avoid cutting off the sides of the car
      // Fit comfortably to width with slight margin
      scale = Math.max(cw / iw, (ch / ih) * 0.52);
      dw = iw * scale;
      dh = ih * scale;
      dx = (cw - dw) / 2;
      dy = (ch - dh) / 2;
    } else {
      // Desktop / laptop widescreen cover
      scale = Math.max(cw / iw, ch / ih);
      dw = iw * scale;
      dh = ih * scale;
      dx = (cw - dw) / 2;
      dy = (ch - dh) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  function onScroll(){
    if(rafPending) return;
    rafPending = true;
    requestAnimationFrame(function(){
      rafPending = false;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      var idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))));
      if(idx !== currentFrame){
        currentFrame = idx;
        drawFrame(currentFrame);
      }
    });
  }

  // Preload all 60 frames
  for(var i = 1; i <= FRAME_COUNT; i++){
    (function(idx){
      var img = new Image();
      img.onload = function(){
        loaded++;
        if(idx - 1 === 0 || idx - 1 === currentFrame) {
          drawFrame(currentFrame);
        }
      };
      img.src = BASE + pad(idx) + '.jpg';
      frames[idx - 1] = img;
    })(i);
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', resize);
  resize();
})();
