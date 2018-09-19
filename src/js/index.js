/**
 * jQuery is not included as default. Please enable jQuery in config.js
 * if you wanna use jQuery.
 */
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
  return function( elem ) {
      return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  };
});

var isInViewport = function (elem) {
  var bounding = elem.getBoundingClientRect();
  return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= ((window.innerHeight) || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

$('.download-green, .floating-btn').click(function() {
  $("html, body").animate({ scrollTop: $(document).height() }, 1000);
});


/* ---------------------------
    Ripple Effect Native JS
--------------------------- */

Element.prototype.rippleEffect = (e) => {
  let self;
  let size;
  let spanEl;
  let rippleX;
  let rippleY;
  let offsetX;
  let offsetY;
  let eWidth;
  let eHeight;

  const btn = Object.prototype.hasOwnProperty.call(e, 'disabled') || e.classList.contains('disabled') ? false : e;

  btn.addEventListener('mousedown', (ev) => {
    self = e;
    // Disable right click
    if (e.button === 2) {
      return false;
    }

    let rippleFlag = 0;
    for (let i = 0; i < self.childNodes.length; i += 1) {
      if (self.childNodes[i].nodeType === Node.ELEMENT_NODE) {
        if (self.childNodes[i].matches('.ripple')) rippleFlag += 1;
      }
    }

    if (rippleFlag === 0) {
      const elChild = document.createElement('span');
      elChild.classList.add('ripple');
      self.insertBefore(elChild, self.firstChild);
    }
    [spanEl] = self.querySelectorAll('.ripple');
    spanEl.classList.remove('animated');

    eWidth = self.getBoundingClientRect().width;
    eHeight = self.getBoundingClientRect().height;
    size = Math.max(eWidth, eHeight);

    spanEl.style.width = `${size}px`;
    spanEl.style.height = `${size}px`;

    offsetX = self.ownerDocument.defaultView.pageXOffset;
    offsetY = self.ownerDocument.defaultView.pageYOffset;

    rippleX = parseInt(ev.pageX - (self.getBoundingClientRect().left + offsetX), 10) - (size / 2);
    rippleY = parseInt(ev.pageY - (self.getBoundingClientRect().top + offsetY), 10) - (size / 2);

    spanEl.style.top = `${rippleY}px`;
    spanEl.style.left = `${rippleX}px`;
    spanEl.classList.add('animated');

    setTimeout(() => {
      spanEl.remove();
    }, 800);

    return ev;
  });
};

const rippleEl = document.querySelectorAll('.ripple-effect');
for (let i = 0; i < rippleEl.length; i += 1) {
  rippleEl[i].rippleEffect(rippleEl[i]);
}

const isOnViewport = (element) => {
  const windowTop = window.scrollY;
  const windowBottom = window.scrollY + window.innerHeight;

  const elemTop = element.offsetTop;
  const elemBottom = elemTop + element.offsetHeight;

  return (elemTop >= windowTop) && (elemBottom <= windowBottom);
};

const initPivot = () => {
  const pivotDelay = 200;
  const overlay = document.getElementsByClassName('overlay')[0];
  const pivotContainer = document.getElementsByClassName('pivot-container')[0];
  const pivotButton = document.querySelectorAll('.pivot-button, .pivot-container');

  let pivotEnterTimeout;
  let pivotLeaveTimeout;

  pivotButton.forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
      clearTimeout(pivotLeaveTimeout);

      pivotEnterTimeout = setTimeout(() => {
        pivotContainer.classList.add('pivot-container--active');
        overlay.classList.add('active');
      }, pivotDelay);
    });

    elem.addEventListener('mouseleave', () => {
      clearTimeout(pivotEnterTimeout);

      pivotLeaveTimeout = setTimeout(() => {
        pivotContainer.classList.remove('pivot-container--active');
        overlay.classList.remove('active');
      }, pivotDelay);
    });
  });
};

const gtmImpression = (dataLayer) => {
  const gtmElement = document.querySelectorAll('[data-impression]:not(.viewed)');

  gtmElement.forEach((elem) => {
    if (isOnViewport(elem)) {
      dataLayer.push(JSON.parse(elem.getAttribute('data-impression')));
      elem.classList.add('viewed');
    }
  });
};

const initGtmClickListener = (dataLayer) => {
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('a[data-click]')) {
      const gtmProps = JSON.parse(event.target.getAttribute('data-click'));
      const targetUrl = event.target.getAttribute('href');

      gtmProps.eventCallback = () => {
        document.location = targetUrl;
      };

      dataLayer.push(gtmProps);
    }
  });
};

// $('.tab-content .video-container .video-wrapper .video').height($('.tab-content .video-container .video-wrapper .video').width() * 2.15);

$('.video-container .video-wrapper .video').each(function(){
  $(this).height($(this).width() * 2.15);
});

$(window).on('resize', function() {
  $('.video-container .video-wrapper .video').each(function(){
    $(this).height($(this).width() * 2.15);
  });
  $('.tab-thumb').css({
    height: $('.tab').eq(0).innerHeight(),
    width: $('.tab').eq(0).innerWidth(),
    left: $('.tab').eq(0).position().left,
  });
});

window.onload = () => {
  $('body').removeClass('fixed');
  $('.loader, img.loader-img').addClass('remove');
  setTimeout(function() {
    $('.loader, img.loader-img').remove();
  }, 1500);
  
  const dataLayer = window.dataLayer || [];

  initPivot();
  initGtmClickListener(dataLayer);

  gtmImpression(dataLayer);

  let lastScrollTop = 0;
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  window.onscroll = () => {
    if(w > 992){
    var st = window.pageYOffset || document.documentElement.scrollTop; 
    let header = document.getElementsByClassName("top-navigation")[0];
    if (st > lastScrollTop){
        document.getElementsByClassName("top-navigation")[0].classList.add('removed');
    } else {
      document.getElementsByClassName("top-navigation")[0].classList.remove('removed');
    }
    
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }
    gtmImpression(dataLayer);
  };

  $('.tab-thumb').css({
    height: $('.tab').eq(0).innerHeight(),
    width: $('.tab').eq(0).innerWidth(),
    left: $('.tab').eq(0).position().left,
  });

  var rightText = true;

  

  $(document).on('click', '.tab:not(.active)', function() {
    $('.tab').removeClass('active');
    $('.tab-thumb').css({
      left: $(this).position().left,
      width: $(this).innerWidth(),
    })
    $(this).addClass('active');

    const video = $(this).data('video');
    const title = $(this).data('title');
    const description = $(this).data('description');
    const circle1 = $(this).data('circle-1');
    const circle2 = $(this).data('circle-2');

    $('body, html').addClass('fixed');

    $('.tab-content .video-container .background').addClass('fadeout');
    $('.tab-content .video-container .video-wrapper').addClass('fallingdown');
    $('.tab-content .video-container .circle-1-wrapper, .tab-content .video-container .circle-2-wrapper, .tab-content .video-container .box-1, .tab-content .video-container .box-2').addClass('scaledown');
    $('.text-container h2, .text-container .seperator, .text-container p').addClass('hidden');
    setTimeout(function() {
      //switching text position
      rightText = !rightText;
      if(rightText) {
        $('.text-container').insertAfter($('.tab-content .video-container'));
      } else {
        $('.text-container').insertBefore($('.tab-content .video-container'));
      }

      $('.tab-content .video-container video').attr('src', video);
      $('.text-container h2').html(title);
      $('.text-container p').html(description);
      $('.circle-1 img').attr('src', circle1);
      $('.circle-2 img').attr('src', circle2);

      $('.tab-content .video-container .circle-1-wrapper, .tab-content .video-container .circle-2-wrapper, .tab-content .video-container .box-1, .tab-content .video-container .box-2').css('transitionTimingFunction', 'cubic-bezier(0.175, 0.885, 0.32, 1.275)');

      $('.tab-content .video-container .background').removeClass('fadeout');
      $('.tab-content .video-container .video-wrapper').removeClass('fallingdown');
      $('.tab-content .video-container .circle-1-wrapper, .tab-content .video-container .circle-2-wrapper, .tab-content .video-container .box-1, .tab-content .video-container .box-2').removeClass('scaledown');
      setTimeout(function() {
        $('.text-container h2, .text-container .seperator, .text-container p').removeClass('hidden');
      }, 50);
      $('.tab-content .video-container .circle-2-wrapper').on('transitionend webkitTransitionEnd oTransitionEnd', function() {
        $('.tab-content .video-container .circle-1-wrapper, .tab-content .video-container .circle-2-wrapper, .tab-content .video-container .box-1, .tab-content .video-container .box-2').css('transitionTimingFunction', '');
      });
      $('body, html').removeClass('fixed');
    }, 1000);
  });
};

  $('.hidden').each( function() {
    if(isInViewport($(this)[0])) {
      $(this).removeClass(['hidden']);
      if($(this).hasClass('download')) {
        $(this).on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          $(this).removeClass(['delayed-3', 'delayed-4']);
        });
      }
    }
  });

$(window).scroll(function() {
  $('.hidden').each( function() {
    if(isInViewport($(this)[0])) {
      $(this).removeClass(['hidden']);
    }
  });
  if($(window).scrollTop() > $('.download-green').offset().top + $('.download-green').outerHeight() && $(window).scrollTop()+$(window).height() < $('.footer-banner').offset().top) {
    $('.floating-btn-container').addClass('active');
  } else {
    $('.floating-btn-container').removeClass('active');
  }
});

setInterval(function() {
  setTimeout(function(){
    $('.toped').css('backgroundPositionX','99%');
  }, 100);
  setTimeout(function(){
    $('.toped').css('backgroundPositionX','0%');
  }, 200);
}, 3000);

