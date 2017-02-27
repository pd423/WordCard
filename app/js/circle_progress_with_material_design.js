var $loader = $('.loader');
$loader.append('<canvas />');
var $canvas = $('canvas');
$canvas.attr('height', $loader.height());
$canvas.attr('width', $loader.width());
var canvas = $canvas[0];
var ctx = canvas.getContext('2d');
var requestAnimationFrame = window.webkitRequestAnimationFrame;
var lastTime = 0;
var total = 0;

/**
 x = percent completed,
 t = current time,
 b = starting value,
 c = change in value,
 d = duration
 */
var easings = {
  easeLinear: function (x, t, b, c, d) {
      return b + (c) * (t / d);
  }
};

var offset = Math.PI * -0.5;
var duration = 4000;
var arc = {
  begin: 0 + offset,
  end: 0 + offset,
  keyframes: [{
    start: 0, end: 500, props: {
      begin: {
        start: 0, change: 1, ease: 'easeLinear'
      },
      end: {
        start: 0, change: 2, ease: 'easeLinear'
      }
    }
  }, {
    start: 500, end: 1000, props: {
      begin: {
        start: 1, change: 2, ease: 'easeLinear'
      },
      end: {
        start: 2, change: 1, ease: 'easeLinear'
      }
    }
  }, {
    start: 1000, end: 1500, props: {
      begin: {
        start: 3, change: 2, ease: 'easeLinear'
      },
      end: {
        start: 3, change: 1, ease: 'easeLinear'
      }
    }
  }, {
    start: 1500, end: 2000, props: {
      begin: {
        start: 5, change: 1, ease: 'easeLinear'
      },
      end: {
        start: 4, change: 2, ease: 'easeLinear'
      }
    }
  }, {
    start: 2000, end: 2500, props: {
      begin: {
        start: 6, change: 1, ease: 'easeLinear'
      },
      end: {
        start: 6, change: 2, ease: 'easeLinear'
      }
    }
  }, {
    start: 2500, end: 3000, props: {
      begin: {
        start: 7, change: 2, ease: 'easeLinear'
      },
      end: {
        start: 8, change: 1, ease: 'easeLinear'
      }
    }
  }, {
    start: 3000, end: 3500, props: {
      begin: {
        start: 9, change: 2, ease: 'easeLinear'
      },
      end: {
        start: 9, change: 1, ease: 'easeLinear'
      }
    }
  }, {
    start: 3500, end: 4000, props: {
      begin: {
        start: 11, change: 1, ease: 'easeLinear'
      },
      end: {
        start: 10, change: 2, ease: 'easeLinear'
      }
    }
  }]
};

function animate(timeDifference) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var percent = total / duration;
  
  arc.keyframes.forEach(function (keyframe) {
    if (keyframe.start > total || keyframe.end < total) {
      return;
    }
    
    for (var key in keyframe.props) {
      if (keyframe.props.hasOwnProperty(key)) {
        arc[key] = easings[keyframe.props[key].ease](percent, total - keyframe.start, keyframe.props[key].start, keyframe.props[key].change, keyframe.end - keyframe.start);
      }
    }
  });
 
  draw();
}

function draw() {
  drawArc(arc);
}

function drawArc(arc, color) {
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  var begin = arc.begin * Math.PI + (-0.5 * Math.PI);
  var end = arc.end * Math.PI + (-0.5 * Math.PI);
  var counterClockwise = false;
  
  if (Math.abs(begin - end) < 0.05) {
    begin -= 0.025;
    end += 0.025;
  }
  
  if (begin > end) {
    counterClockwise = true
  }
  
  ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width / 2 - 10), begin, end, counterClockwise);
  ctx.strokeStyle = color ? color :'#5677fc';
  ctx.stroke();
}

function render(final) {
  var currentTime = (new Date()).getTime();
  var difference = currentTime - lastTime;
  
  animate(difference);
  lastTime = currentTime;
  
  total += difference;
  
  if (total < duration && !final) {
    requestAnimationFrame(function () {
      render();
    });
  } else if (!final) {
    requestAnimationFrame(function () {
      total = duration;
      render(true);
    });
  }
  
  if (final) {
    total = 0;
    requestAnimationFrame(function () {
      render();
    });
  }
}

requestAnimationFrame(function () {
  lastTime = (new Date()).getTime();
  render();
});