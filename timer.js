'use strict';

class Timer
{
  /**
  * Create new instance of Timer.
  *
  * @param Function callback Function to be called every time step
  *                          with time diff in seconds.
  */
  constructor(callback, step = 1/120)
  {
    this.step = step;
    this.tick = 0;

    this._callback = callback;

    this._accumulator = 0;
    this._frameId = null;
    this._running = false;
    this._timeLast = null;

    this._cancelAnimationFrame = cancelAnimationFrame.bind(window);
    this._requestAnimationFrame = requestAnimationFrame.bind(window);

    this._eventLoop = this._eventLoop.bind(this);
  }

  /**
  * Request event loop to be called on next frame.
  */
  _enqueue()
  {
    this._frameId = this._requestAnimationFrame(this._eventLoop);
  }

  /**
  * Handler for requestAnimationFrame
  *
  * @param int time Elapsed time in milliseconds.
  */
  _eventLoop(time)
  {
    if (this._timeLast !== null) {
      this._accumulator += (time - this._timeLast) / 1000;
      while (this._accumulator > this.step) {
        this._callback(this.step);
        this._accumulator -= this.step;
        ++this.tick;
      }
    }
    this._timeLast = time;

    if (this._running) {
        this._enqueue();
    }
  }

  /**
  * Start timer.
  */
  start()
  {
    if (this._running) {
        return;
    }
    this._running = true;
    this._timeLast = null;
    this._enqueue();
  }

  /**
  * Stop timer.
  */
  stop()
  {
    this._cancelAnimationFrame(this._frameId);
    this._running = false;
  }
}
