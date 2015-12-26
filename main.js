(function (window) {
  console.log('Hello from Cuddly Telegram');

  var comment_types = { TOP_SLIDE: 0, TOP_STICK: 1, BOTTOM_STICK: 2 };
  var comment_type_names = { 'top': 0, 'bottom': 2 }; // Workaround = =

  var comment_v_chunk_height = 5;
  var CommentBoardTopSlide = function (width, height) {
    this.width = width;
    this.height = height;
    this.next_unblock = [];
    this.next_clear = [];
    for (var i = 0; i <= Math.ceil(height / comment_v_chunk_height); ++i) {
      this.next_unblock[i] = 0;
      this.next_clear[i] = 0;
    }
  };
  CommentBoardTopSlide.prototype.fire = function (id, message, color) {
    var now = Date.now();
    // Create DOM element
    var bullet = $('<div>').addClass('bullet').html(message);
    $('body').append(bullet);
    // Calculate size
    var cmt_w = bullet.width(), cmt_h = bullet.height();
    // Animations
    var duration = Math.random() * 8000 + 3000;
    var speed = (this.width + cmt_w) / duration;
    // Allocate space
    var positioning_data = null;
    var unblock_time = now + cmt_w / speed;
    var border_touch_time = now + this.width / speed;
    var fully_out_time = now + duration;
    var v_chunks = Math.ceil(cmt_h / comment_v_chunk_height);
    for (var i = 0; i <= this.next_unblock.length - v_chunks; ++i) {
      if (this.next_unblock[i] <= now && this.next_clear[i] <= border_touch_time) {
        var j, valid = true;
        for (j = i; j < i + v_chunks; ++j)
          if (this.next_unblock[i] > now || this.next_clear[i] > border_touch_time) {
            valid = false; break;
          }
        if (valid) {
          for (j = i; j < i + v_chunks; ++j) {
            this.next_unblock[j] = unblock_time;
            this.next_clear[j] = fully_out_time;
          }
          positioning_data = {top: comment_v_chunk_height * i, speed: speed};
          break;
        } else {
          i = j;
        }
      }
    }
    if (positioning_data === null) {
      bullet.remove();
      return false;
    }
    // Add DOM element to the page
    bullet.css('left', this.width).css('top', positioning_data.top);
    bullet.animate({left: -cmt_w}, duration, 'linear');
    //setTimeout(function () { bullet.remove(); }, duration);
    return true;
  };

  var comment_board_cnt = 4;
  var comment_board_topslide = [];
  for (var i = 0; i < comment_board_cnt; ++i) {
    comment_board_topslide[i] = new CommentBoardTopSlide(document.documentElement.clientWidth, document.documentElement.clientHeight);
  }
  var comment_board_fire = function (c) {
    if (comment_type_names[c.type] === comment_types.TOP_SLIDE) {
      comment_board_topslide[0].fire(c.id, c.message, c.color);
    }
  };

  //var socket = new WebSocket('<?php $channel = new SaeChannel();echo $channel -> createChannel('danmaku',18000);?>');
  // Workaround x2...
  // Workaround x3: http://stackoverflow.com/questions/17088609/disable-firefox-same-origin-policy/29096229#29096229
  /*var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://app.efzer.org/live/2016newyear/danmaku.php', false);
  xhr.send();
  var socket = new WebSocket(xhr.response.substr(4299, 115));
  socket.onmessage = function (msg) {
    comment_board_fire(JSON.parse(msg.data));
  };
  window.___socket = socket;*/
  window.f = comment_board_fire;
  // f({id: 233, message: 'xaxx', type: 'top', color: '#c0c0ff'})
}(window));