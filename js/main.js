/* -----------------------------------------------------------
  scrollTimer
----------------------------------------------------------- */

let scrollTimer;

window.addEventListener('scroll', () => {
	//scrollTimerがセットされていればタイマーを解除して、改めてタイマーをセットしなおす。
	if(scrollTimer != null){
		clearTimeout(scrollTimer);
	}
	//100ミリ秒後に関数を実行するタイマーをセット。
	scrollTimer = setTimeout(() => {
    scrolledHeader();
    topTitleHide();
	}, 100);
});

/* -----------------------------
  header change
----------------------------- */
const header = document.querySelector('header');

function scrolledHeader() {
  header.classList.add('scrolled');

  if(window.scrollY === 0) {
    header.classList.remove('scrolled');
  }
}
scrolledHeader();

/* -----------------------------
  top height smooth change
----------------------------- */

const topSection = document.querySelector('#top'),
      topTitle = document.querySelector('h1'),
      scrollText = document.querySelector('.scroll-text'),
      scrollArrow = document.querySelector('.scroll-arrow');

window.addEventListener('resize', topSetHeight);

function topSetHeight() {
  let currentHeight = window.innerHeight;

  topTitle.style.top = `${currentHeight * 0.5}px`;
  scrollText.style.top = `${currentHeight * 0.75}px`;
  scrollArrow.style.top = `${currentHeight * 0.75 + 70}px`;
}
topSetHeight();

/* -----------------------------
  top contents hide
----------------------------- */

const topContents = document.querySelectorAll('.top-contents-hide'),
      intro = document.querySelector('#intro');
      // "topTitle" and "topSection" have already been defined. 

function topTitleHide() {
  let rectTopTitle = topTitle.getBoundingClientRect(),
      rectIntro = intro.getBoundingClientRect(),
      topTitleTop = rectTopTitle.top,
      introBottom = rectIntro.bottom;

  // Psuedo change by styleSheet operation -------------
  let targetCSS;
      
  function getPseudo() {
    let css = window.document.styleSheets.item( 1 ),
        rules = css.cssRules || css.rules,
        rules_length = rules.length;
  
    for(let i = 0; i < rules_length; i++ ){
      if(rules.item( i ).selectorText === '#top::before') {
        targetCSS = rules.item(i);
      }
    }
  };
  getPseudo();
  // ---------------------------------------------------

  if(topTitleTop > introBottom) {
    for(let i = 0; i < topContents.length; i++) {
      topContents[i].style.zIndex = '-1';
      topContents[i].style.visibility = 'hidden';
    }
    targetCSS.style.setProperty('z-index', '-1');
    targetCSS.style.setProperty('visibility', 'hidden');
  } else {
    for(let j = 0; j < topContents.length; j++) {
      topContents[j].style.zIndex = '0';
      topContents[j].style.visibility = 'visible';
    }
    targetCSS.style.setProperty('z-index', '0');
    targetCSS.style.setProperty('visibility', 'visible');
  }
}
topTitleHide();
window.addEventListener('scroll', topTitleHide);

/* -----------------------------
  smooth scroll to the next contnt
----------------------------- */

const scrollButton = document.querySelectorAll('.scroll-button');
// "intro" has already been defined.

function scrollNext() {
  for(let i = 0; i < scrollButton.length; i++) {
    scrollButton[i].addEventListener('click', (event) => {
      event.preventDefault();
      smoothScroll();
    });
  }
}
scrollNext();

function smoothScroll() {
  const decelerationRate = 0.1;

  let rectIntro = intro.getBoundingClientRect(),
      introTop = rectIntro.top,
      introTopPos = window.pageYOffset + introTop,
      currentScroll = window.scrollY,
      progressTimer;

  progressTimer = setInterval(updateprogress, 1000 / 60);

  function updateprogress() {
    currentScroll += (introTopPos - currentScroll) * decelerationRate;
    window.scrollTo(0, currentScroll);

    if(introTopPos - currentScroll < 2) {
			clearInterval(progressTimer);
			window.scrollTo(0, introTopPos);
			return;
		}
  }
}

/* -----------------------------
  news parallax
----------------------------- */

const news = document.querySelector('#news'),
      category = document.querySelector('#category'),
      gallery = document.querySelector('#gallery');

function newsParallax() {

  let buffer = 200, // parallaxを適用する範囲のマージン、大きくすると変化のスピードが遅くなる
      categoryBottom = category.getBoundingClientRect().bottom,
      galleryTop = gallery.getBoundingClientRect().top,
      windowHeight = document.documentElement.clientHeight,
      newsWidth = news.clientWidth,
      newsHeight = news.clientHeight,
      currentPos = window.scrollY,
      startPoint = window.pageYOffset + categoryBottom - windowHeight - buffer, // fixed
      endPoint = window.pageYOffset + galleryTop + buffer, // fixed
      bgSizeCheck,
      bgImgHeight;

/* resize timer */
  let resizeTimer;

  window.addEventListener('resize', () => {
    //resizeTimerがセットされていればタイマーを解除して、改めてタイマーをセットしなおす。
    if(resizeTimer != null){
      clearTimeout(resizeTimer);
    }
    //1000ミリ秒後に関数を実行するタイマーをセット。
    resizeTimer = setTimeout(() => {
      bgSizeSwitch();
    }, 500);
  });
/* ------------- */

  window.addEventListener('scroll', () => {
    currentPos = window.scrollY;

    if(currentPos >= startPoint && currentPos <= endPoint) {
      newsBgMove();
    }
  });

  function bgSizeSwitch() {
    newsWidth = news.clientWidth;
    newsHeight = news.clientHeight;

    if(newsWidth > newsHeight / 2 * 3) {
      news.style.backgroundSize = '150% auto';
      bgSizeCheck = 'width';
    } else {
      news.style.backgroundSize = 'auto 150%';
      bgSizeCheck = 'height';
    }

    if(bgSizeCheck === 'width') {
      bgImgHeight = newsWidth; // 画像サイズが3:2 かつ 画像を150% → 表示領域のwidthと同じになる
    } else {
      bgImgHeight = newsHeight * 1.5;
    }

    buffer = 200 + (600 - 200) * (newsWidth - 400) / (2000 - 400);
  }
  bgSizeSwitch();

  function newsBgMove() {
    maxDistance = (bgImgHeight - newsHeight) * (-1);
    distance = maxDistance * (currentPos - startPoint) / (endPoint - startPoint);
    news.style.backgroundPositionY = `${distance}px`;
  }
}
newsParallax();

/* -----------------------------
  gallery parallax
----------------------------- */

const footer = document.querySelector('footer'),
      galleryL = document.getElementsByClassName('gallery-left'),
      galleryC = document.getElementsByClassName('gallery-center'),
      galleryR = document.getElementsByClassName('gallery-right'),
      spSizeTop = 70;
      // news and gallery have already been defined.

const mediaQueryList = matchMedia('(min-width: 450px)');
mediaQueryList.addListener(galleryParallax);

function galleryParallax() {
  if(mediaQueryList.matches === true) {
    window.addEventListener('resize', galleryMove);
  } else {
    window.removeEventListener('resize', galleryMove);
  }
}

function galleryMove() {

  let leftTop = getComputedStyle(galleryL[0]).top,
      centerTop,
      rightTop,
      buffer = 50, // parallaxを適用する範囲のマージン、大きくすると変化のスピードが遅くなる
      newsBottom = news.getBoundingClientRect().bottom,
      footerTop = footer.getBoundingClientRect().top,
      windowHeight = document.documentElement.clientHeight,
      galleryWidth = gallery.clientWidth,
      adjuster = 12 + (30 - 12) * (galleryWidth - 450) / (2000 - 450),
      currentPos = window.scrollY,
      startPoint = window.pageYOffset + newsBottom - windowHeight - buffer, // fixed
      endPoint = window.pageYOffset + footerTop + buffer; // fixed

  if(mediaQueryList.matches === true) {
    window.addEventListener('scroll', tabletPcSizeAction);
  } 

  mediaQueryList.addListener(spSizeAction);
  
  function spSizeAction() {
    if(mediaQueryList.matches === false) {

      window.removeEventListener('scroll', tabletPcSizeAction);

      for(let i = 0; i < galleryC.length; i++) {
        galleryL[i].style.top = `${spSizeTop}px`;
        galleryC[i].style.top = `${spSizeTop}px`;
        galleryR[i].style.top = `${spSizeTop}px`;
      }
    }
  }

  function tabletPcSizeAction() {
    currentPos = window.scrollY;

    if(currentPos >= startPoint && currentPos <= endPoint) {
      leftTop = adjuster + 100 + (40 - 100) * (currentPos - startPoint) / (endPoint - startPoint);
      centerTop = adjuster + 100 + (-30 - 100) * (currentPos - startPoint) / (endPoint - startPoint);
      rightTop = adjuster + 100 + (-100 - 100) * (currentPos - startPoint) / (endPoint - startPoint);
  
      for(let i = 0; i < galleryC.length; i++) {
        galleryL[i].style.top = `${leftTop}px`;
        galleryC[i].style.top = `${centerTop}px`;
        galleryR[i].style.top = `${rightTop}px`;
      }
    }
  }
}
galleryMove();

/* -----------------------------
  hamburger menu
----------------------------- */

const hamburgerButton = document.querySelector('#hamburger-button'),
      gNav = document.querySelector('#hamburger-menu'),
      gNavClose = gNav.querySelector('.close-button'),
      menuAnchors = gNav.getElementsByClassName('menu-anchor');

function hamburger() {
  let windowWidth = window.innerWidth,
      gNavWidth;

  if(windowWidth <= 450) {
    gNavWidth = windowWidth * 0.65;
  } else if (windowWidth >= 1140) {
    gNavWidth = windowWidth * 0.20;
  } else {
    gNavWidth = windowWidth * 0.65 + (windowWidth * (0.20 - 0.65) * (windowWidth - 450) / (1140 - 450));
  }

  gNav.style.width = `${gNavWidth}px`;

  hamburgerButton.addEventListener('click', (event) => {
    event.preventDefault();
    gNav.style.transform = 'translateX(0)';
    setTimeout(() => {
      for(let i = 0; i < menuAnchors.length; i++) {
        menuAnchors[i].style.transform = 'translateY(0)';
      }
    }, 350);
  });

  gNavClose.addEventListener('click', (event) => {
    event.preventDefault();
    for(let i = 0; i < menuAnchors.length; i++) {
      menuAnchors[i].style.transform = 'translateY(100%)';
    }
    setTimeout(() => {
      gNav.style.transform = 'translateX(100%)';
    }, 250);
  });
}
window.addEventListener('resize', hamburger);
hamburger();

