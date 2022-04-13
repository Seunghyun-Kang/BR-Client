import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PagestatusService } from 'src/app/services/pagestatus.service';

let screenId = "dashboard"

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})

export class IntroComponent implements OnInit, OnDestroy {
  public canvas: HTMLCanvasElement;
  public UIToggleButton: HTMLElement;
  private starfield: any
  private isGalaxyOff: boolean = false

  constructor(private service: PagestatusService) {
  }

  ngOnInit(): void {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.UIToggleButton = document.getElementById("mouse-control-control") as HTMLElement;
  }

  ngAfterViewInit(): void {
    var howManyStars: number = IS_MOBILE ? 400 : 1000;
    
    this.service.getStatus().subscribe((value) => {
      console.log("WEB STATUS CHANGED ::" + value);
      if (screenId === 'dashboard' && value === "normal") return

      switch (value) {
        case "GalaxyOff":
          this.isGalaxyOff = true
          this.starfield.destroy();
          this.starfield = undefined
          break;
        case "GalaxyOn":
          this.isGalaxyOff = false
          value = "normal"
          screenId = value;
          this.starfield = new StarField(howManyStars, this.canvas);
          this.starfield.startRenderLoop();
          break;
        default:
          if (this.isGalaxyOff) return
          screenId = value;
          if (this.starfield !== undefined) {
            this.starfield.destroy();
            this.starfield = undefined
          }
          this.starfield = new StarField(howManyStars, this.canvas);
          this.starfield.startRenderLoop();
          break;
      }
    });
  }

  ngOnDestroy() {
    console.log("destroy :: " + screenId);
    if (IS_MOBILE) return
    this.canvas.removeEventListener('resize', this.starfield.handleResize)
    this.canvas.removeEventListener('beforeunload', this.starfield.rePopulateStarField)
  }
}
/*
* Table of Contents:
* 
*   types:
*   - vec2 [0, 0]
*   - vec3 [0, 0, 0]
*   
*   classes:
*   - Star
*   - StarField
* 
*   helper functions:
*   - randRange
*   - mapRange
*   - distance
*   - limitToCircle
*   - isInEllipse
*   - getPointerInput // sends mouse or touch data to a callback
*   - setup // where we initialize the Starfield.
*   
*   ENV Vars:
*   - IS_HIGH_RES // sort of an environment variable for detecting retina type screens
*   - IS_MOBILE // detect if it's android, ios, or other common mobile devices
*   - IS_HIGH_RES_AND_MOBILE // just combines the two above for convenience
*/

// am I weird for enjoying writing functions like this by hand? lol

function randRange(min: any, max: any): number {
  return Math.random() * (max - min) + min;
}
function mapRange(value: any, low1: any, high1: any, low2: any, high2: any): number {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function distance(dot1: any, dot2: any) {
  let [x1, y1, x2, y2] = [dot1[0], dot1[1], dot2[0], dot2[1]];
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
// not used, but fun to write after figuring out the 2D version
// function distance3D(dot1, dot2) {
//   let [x1, y1, z1, x2, y2, z2] = [dot1[0], dot1[1], dot1[2], dot2[0], dot2[1], dot2[2]];
//   return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
// }
function limitToCircle(x: any, y: any, a: any, b: any, r: any) {
  let dist = distance([x, y], [a, b]);
  if (dist <= r) {
    return [x, y];
  } else {
    x = x - a;
    y = y - b;
    let radians = Math.atan2(y, x)
    return [Math.cos(radians) * r + a, Math.sin(radians) * r + b];
  }
}
function isInEllipse(mouseX: any, mouseY: any, ellipseX: any, ellipseY: any, ellipseW: any, ellipseH: any) {
  let dx = mouseX - ellipseX;
  var dy = mouseY - ellipseY;
  return ((dx * dx) / (ellipseW * ellipseW) + (dy * dy) / (ellipseH * ellipseH) <= 1);
}

type vec2 = [number, number];
type vec3 = [number, number, number];

const IS_HIGH_RES = window.matchMedia(`
    (-webkit-min-device-pixel-ratio: 2),
    (min--moz-device-pixel-ratio: 2),
    (-moz-min-device-pixel-ratio: 2),
    (-o-min-device-pixel-ratio: 2/1),
    (min-device-pixel-ratio: 2),
    (min-resolution: 192dpi),
    (min-resolution: 2dppx)
  `);

const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const IS_HIGH_RES_AND_MOBILE = (IS_HIGH_RES.matches);

class Star {
  private FORWARD_SPEED;
  private SIDEWAYS_SPEED;
  private container;
  private x;
  private y;
  private z;
  private px;
  private py;
  private pz;
  private color;

  constructor(container: vec2) {
    let [size, depth] = container;

    this.FORWARD_SPEED = 500;
    this.SIDEWAYS_SPEED = 100;
    if (IS_HIGH_RES_AND_MOBILE || IS_MOBILE) {
      this.FORWARD_SPEED *= 2;
      this.SIDEWAYS_SPEED *= 2;
    }

    this.container = container;

    this.x = randRange(-size, size);
    this.y = randRange(-size, size);
    this.z = randRange(0, depth);

    // previous position for the trails
    this.px = this.x;
    this.py = this.y;
    this.pz = this.z;

    // purple, green, and blue, but randomized ^.^
    this.color = `rgb(${randRange(110, 200)},${randRange(110, 240)},${randRange(230, 255)})`;
  }

  resetX() {
    let [size, _] = this.container;
    this.x = randRange(-size, size);
    this.px = this.x;
  }
  resetY() {
    let [size, _] = this.container;
    this.y = randRange(-size, size);
    this.py = this.y;
  }
  resetZ() {
    let [_, depth] = this.container;
    this.z = randRange(0, depth);
    this.pz = this.z;
  }

  update(
    deltaTime: number,
    container: vec2,
    xSpeed: number,
    zSpeed: number
  ) {
    this.container = container;
    let [size, depth] = container;
    let sizeAndAQuarter = size + size / 4;
    let depthMinusAQuarter = depth - depth / 4;

    let defaultSpeed = this.FORWARD_SPEED;
    let defaultSideSpeed = this.SIDEWAYS_SPEED;

    if (zSpeed > 0) {
      let slowBy = mapRange(this.z, 0, depth, 1, 0.01);
      defaultSpeed *= slowBy;
    } else if (zSpeed < 0) {
      let slowBy = mapRange(this.z, 0, depth, 1, 0.1);
      defaultSpeed *= slowBy;
    }

    if (Math.abs(xSpeed) > 0) {
      let slowBy = mapRange(this.z, 0, size, 0.3, 0.4);
      defaultSideSpeed *= slowBy;
    }

    /*
    * Easter Egg #1 ^.^
    * uncomment the snippet below to make 'em wiggle
    */

    let movementFuzz = Math.sin(deltaTime) * randRange(-50, 50);
    this.y -= movementFuzz;

    // move forward, obvi
    this.z -= (defaultSpeed * zSpeed * deltaTime);
    // and sideways
    this.x -= defaultSideSpeed * xSpeed * deltaTime;

    // keep within bounds on z axis
    let fuzzyDepth = randRange(depth, depthMinusAQuarter);
    // keep within bounds on x axis
    let fuzzySize = randRange(size, sizeAndAQuarter);

    if (this.z < 1) { // z negative
      this.z = fuzzyDepth;
      this.pz = this.z;
      this.resetX();
      this.resetY();
    } else if (this.z > depth) { // z positive
      this.z = 0;
      this.pz = this.z;
      this.resetX();
      this.resetY();
    } else if (this.x < -fuzzySize) { // x negative
      this.x = size;
      this.px = this.x;
      this.resetY();
      this.resetZ();
    } else if (this.x > fuzzySize) { // x positive
      this.x = -size;
      this.px = this.x;
      this.resetY();
      this.resetZ();
    } else if (this.y < -fuzzySize) { // y negative
      this.y = size;
      this.py = this.y;
      this.resetX();
      this.resetZ();
    } else if (this.y > fuzzySize) { // y positive
      this.y = -size;
      this.py = this.y;
      this.resetX();
      this.resetZ();
    }
  }

  draw(context: CanvasRenderingContext2D, container: vec2, screen: vec2, mouseX: number, mouseY: number) {
    let [width, height] = screen;
    let [size, depth] = container;

    let sx = mapRange(this.x / this.z, 0, 1, 0, width);
    let sy = mapRange(this.y / this.z, 0, 1, 0, height);

    let px = mapRange(this.px / this.pz, 0, 1, 0, width);
    let py = mapRange(this.py / this.pz, 0, 1, 0, height);

    var maxRadius = (IS_HIGH_RES.matches) ? 3 : 1.5;
    if (IS_MOBILE) { maxRadius = 1.5 }
    let radius = Math.min(Math.abs(mapRange(this.z, 0, depth, maxRadius, 0.01)), maxRadius);

    // star point
    context.beginPath();
    context.arc(sx, sy, radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();

    this.px = this.x;
    this.py = this.y;
    this.pz = this.z;

    // star trail
    context.beginPath();
    context.moveTo(px, py);
    context.lineTo(sx, sy);
    context.lineWidth = radius;
    context.strokeStyle = this.color;
    context.stroke();

    /*
    * Easter Egg #2 ^.^
    * uncomment the snippet below to add little tracer lines that follow the mouse/touch
    */

    // if (Math.min(width, height)/2 > distance([mouseX, mouseY], [sx, sy]) && this.z < depth/2) {
    //   context.beginPath();
    //   context.moveTo(sx, sy);
    //   let [mX, mY] = limitToCircle(mouseX, mouseY, sx, sy, 50);
    //   context.lineTo(mX, mY);
    //   context.lineWidth = radius;
    //   context.strokeStyle = this.color.replace(')', `, ${mapRange(this.z, 0, depth, 0.1, 0.6)})`);
    //   context.stroke();
    // }

  }
}

const getPointerInput = (callback: Function, element: HTMLElement, delay: number = 600) => {
  // use a noop if there's no callback, but like, there should be a callback lol
  callback = callback || ((pointer: any) => {
    console.error(`PointerInput is missing a callback as the first argument`);
  });

  let pointer = {
    x: false,
    y: false,
    hasMoved: false,
    isMoving: false,
    wasMoving: false
  };

  let timer: any; // used to track when pointer motion stops
  let animFrame: any; // debounces pointer motion so we don't do extra work needlessly

  // this fn is called on touch and mouse events
  const handlePointer = (event: any) => {
    // if there's an animation frame already for this handler, cancel it
    if (animFrame !== undefined) {
      animFrame = window.cancelAnimationFrame(animFrame);
    }

    // and instead it'll run the latest animation frame
    animFrame = window.requestAnimationFrame(() => {
      let x, y;

      // handle mobile first, otherwise desktop/laptop
      if (event.touches) {
        [x, y] = [event.touches[0].clientX, event.touches[0].clientY];
      } else {
        [x, y] = [event.clientX, event.clientY];
      }

      pointer.x = x;
      pointer.y = y;

      // pointer has moved at least once
      if (!pointer.hasMoved) {
        pointer.hasMoved = true;
      }
      // pointer is currently moving
      pointer.wasMoving = pointer.isMoving;
      pointer.isMoving = true;

      // send the current pointer data to it's consumers
      callback(pointer);

      // if timer already exists, clear it
      if (timer) {
        timer = clearTimeout(timer);
      }
      // start a new timer and store it
      timer = setTimeout(() => {
        // pointer is no longer moving
        pointer.wasMoving = pointer.isMoving;
        pointer.isMoving = false;
        // send the current pointer data to it's consumers again because we stopped moving
        callback(pointer);
      }, delay);
    });
  };

  // set up the handlers ^.^
  element.addEventListener('touchstart', (e) => handlePointer(e), true);
  element.addEventListener('touchmove', (e) => handlePointer(e), true);
  element.addEventListener('mousemove', (e) => handlePointer(e), true);

  return false;
};



class StarField {
  private canvas;
  private context;
  private resizeTimer: any;
  private isResizing;
  private wasResizing;
  private containerDepth;
  private howManyStars;
  private stars;
  private prevTime;
  private deltaTime;
  private xSpeed;
  private zSpeed;
  private mouseX;
  private mouseY;
  private UIFadeDelay;
  private mouseMoving;
  private mouseMoved;
  public mouseControlAlpha;
  public showMouseControls: boolean;
  private pauseAnimation;
  private screen: any;
  private container: any;

  constructor(howManyStars: number, canvas: HTMLCanvasElement, depth: number = 2, UIFadeDelay = 1) {
    this.canvas = canvas;
    // this.context = canvas.getContext('2d');
    this.context = canvas.getContext('2d');
    this.isResizing = false;
    this.wasResizing = false;
    this.containerDepth = depth;
    this.setCanvasSize();

    this.howManyStars = howManyStars;
    this.stars = new Array(howManyStars);
    this.populateStarField();

    this.prevTime = 0;
    this.deltaTime = 0.1;
    this.xSpeed = 0;
    this.zSpeed = 1;

    this.mouseX = 0;
    this.mouseY = (canvas.offsetHeight * 0.25) - 66;

    this.UIFadeDelay = UIFadeDelay;

    // this is where the pointer data affects the animation via xSpeed and zSpeed
    let handlePointer = (pointer: any) => {
      let [width, height] = this.screen;
      this.mouseX = pointer.x - width / 2;
      this.mouseY = pointer.y - height / 2;

      this.mouseMoved = pointer.hasMoved;
      this.mouseMoving = pointer.isMoving;

      this.zSpeed = mapRange(pointer.y, 0, height, 12, -4);
      this.xSpeed = mapRange(pointer.x, 0, width, -10, 10);

      if (Math.abs(this.xSpeed) > 2) {
        this.zSpeed /= (Math.abs(this.xSpeed) / 2);
      }

      if (this.mouseY > 0) {
        this.zSpeed /= 2;
      }
    };



    // getPointerInput doesn't control the animation, just passes pointer data to the callback
    // = pointer detector

    this.mouseMoved = false;
    this.mouseMoving = false;

    this.mouseControlAlpha = 0.1;

    this.pauseAnimation = false;

    // just the initial render, doesn't start the loop
    //this.render();
    this.applySettings(canvas, handlePointer, this.screen)

    window.addEventListener('resize', () => this.handleResize(), true);
    // helps when you navigate away from the page for a while, prevents stars grouping up into one big wall
    // #fuckthewall lol
    window.addEventListener("beforeunload", () => this.rePopulateStarField());
    // not in use yet
    // document.addEventListener("deviceorientation", (e) => this.handleOrientation(e), true);
  }

  destroy() {
    console.log("Stardust field destoryed");
    this.emptyStarField()
  }
  // where the magic happens
  startRenderLoop() {
    const renderLoop = (timestamp: any) => {
      timestamp *= 0.001; // convert to seconds
      this.deltaTime = timestamp - this.prevTime;
      this.prevTime = timestamp;
      if (!this.pauseAnimation) {
        this.clearCanvas();
        this.render();
      }
      window.requestAnimationFrame(renderLoop);
    };
    window.requestAnimationFrame(renderLoop);
  }

  pause() {
    this.pauseAnimation = true;
  }
  play() {
    this.pauseAnimation = false;
  }

  setCanvasSize() {
    // fit canvas to parent
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    let width: number = this.canvas.offsetWidth,
      height: number = this.canvas.offsetHeight,
      size: number = Math.max(width, height),
      depth: number = size * this.containerDepth,
      screen: vec2 = [width, height],
      container: vec2 = [size, depth];

    // set latest sizes
    this.container = container;
    this.screen = screen;

    // center
    if (this.context !== null) this.context.translate(width / 2, height / 2);
  }

  populateStarField() {
    // fill an array with Star instances
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i] = new Star(this.container);
    }
  }
  emptyStarField() {
    this.stars = new Array(this.howManyStars);
  }
  rePopulateStarField() {
    this.emptyStarField();
    this.populateStarField();
    return null;
  }

  clearCanvas() {
    let [size, depth] = this.container;
    if (this.context !== null) this.context.clearRect(-size / 2, -size / 2, size, size);
  }

  drawMouseControl() {
    let context = this.context;
    let [width, height] = this.screen;
    let ellipseX = 0, ellipseY = height * 0.25;
    let ellipseW = 50, ellipseH = 21;

    ellipseH *= mapRange(this.mouseY, -height / 2 + ellipseY, height / 2 + ellipseY, 0.8, 1.2);
    let pointIsInEllipse = isInEllipse(this.mouseX, this.mouseY, ellipseX, ellipseY, ellipseW, ellipseH);

    if (pointIsInEllipse) {
      this.xSpeed = 0;
      this.zSpeed = 0;
    }

    let xSpin = this.mouseX / width;

    // ellipse
    if (context !== null) context.beginPath();
    if (context !== null) context.ellipse(ellipseX, ellipseY, ellipseW, ellipseH, xSpin, 0, 2 * Math.PI);
    if (context !== null) context.strokeStyle = `rgba(255, 255, 255, ${this.mouseControlAlpha})`;
    if (context !== null) context.lineWidth = 2;
    if (context !== null) context.stroke();

    let scaleFactor = 1;

    if (-this.mouseY > 0) {
      scaleFactor = mapRange(Math.abs(this.mouseX / width), 0, 1, 2, 0);
    }

    let lineDist = distance([ellipseX, ellipseY], [this.mouseX, this.mouseY * scaleFactor]);

    let [limitedMouseX, limitedMouseY] = limitToCircle(this.mouseX, this.mouseY, ellipseX, ellipseY, lineDist / 2);

    // input-tracking line
    if (context !== null) context.beginPath();
    if (context !== null) context.moveTo(ellipseX, ellipseY);
    if (context !== null) context.lineTo(limitedMouseX, limitedMouseY);
    if (context !== null) context.stroke();
  }

  applySettings(canvas: any, handlePointer: any, screen: any) {
    switch (screenId) {
      case 'dashboard':
        getPointerInput(handlePointer, canvas);
        this.showMouseControls = true;
        break;
      case 'loading-forward':
        this.zSpeed = 15;
        this.mouseY = -(canvas.offsetHeight);
        this.showMouseControls = false;
        break;
      case 'loading-right':
        this.mouseX = 148;
        this.mouseY = -172;
        this.zSpeed = 2.9132829511976428;
        this.xSpeed = 8.589743589743591;
        this.showMouseControls = false;
        break;
      case 'loading-left':
        this.mouseX = -156;
        this.mouseY = -172;
        this.zSpeed = 2.8151658767772512;
        this.xSpeed = -9;
        this.showMouseControls = false;
        break;
      default:
        this.showMouseControls = false;
        break;
    }
    this.render()
  }

  render() {
    // console.log("!!!!!render");
    if (this.showMouseControls) {
      if (!this.mouseMoved || this.mouseMoving) {
        // when mouse is moving, make controls visible instantly
        this.mouseControlAlpha = 0.3;
        this.drawMouseControl();
      } else {
        // when mouse stops moving, start fading out the opacity slowly
        // TODO: make it actually time based so it fades out over the period you pass it
        // just kinda hacked in a rough approximation by feel on my machine lol
        // good enough for now
        this.mouseControlAlpha -= (0.25 * this.deltaTime) / this.UIFadeDelay;
        this.drawMouseControl();
      }
    }

    // update and draw all the stars
    for (let i = 0; i < this.stars.length; i++) {
      // console.log("!!!!!update and draw all the stars " + this.pauseAnimation);
      if (!this.pauseAnimation && this.stars[i] !== undefined) {
        this.stars[i].update(this.deltaTime, this.container, this.xSpeed, this.zSpeed);
      }
      if (this.stars[i] !== undefined) this.stars[i].draw(this.context, this.container, this.screen, this.mouseX, this.mouseY);
    }
  }

  rePopOnResizeStop() {

    if (this.isResizing && !this.wasResizing) {
      // console.log('started');
    }
    if (!this.isResizing && this.wasResizing) {
      // console.log('stopped');
      this.rePopulateStarField();
    }
  }
  handleResize() {
    this.pause();

    // if a resizing timer exists already clear it out
    if (this.resizeTimer !== undefined) {
      this.resizeTimer = clearTimeout(this.resizeTimer);
    }

    this.wasResizing = this.isResizing;
    if (!this.isResizing) {
      this.isResizing = true;
    }
    this.rePopOnResizeStop();

    if (this.pauseAnimation) {
      window.requestAnimationFrame(() => {
        this.setCanvasSize();
        this.render();
      });
    }

    this.resizeTimer = setTimeout(() => {
      this.wasResizing = this.isResizing;
      this.isResizing = false;
      this.rePopOnResizeStop();
      this.setCanvasSize();
      this.play();
    }, 200);
  }
}


