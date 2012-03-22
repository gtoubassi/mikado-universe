#import('dart:html', prefix:'dart');

#source('Point.dart');
#source('Segment.dart');
#source('Circle.dart');
#source('Rectangle.dart');
#source('Polygon.dart');
#source('Ray.dart');
#source('Particle.dart');
#source('Universe.dart');
#source('Test.dart');

class Mikado {
  
  Universe universe;
  dart.Element stepCountElement;
  dart.Element distanceElement;
  dart.CanvasElement canvas;
  int interval;

  Mikado() : interval = null {
  }

  void draw() {
    var context = canvas.getContext('2d');
    context.save();
    context.scale(400, 400);
    universe.draw(context);
    context.restore();
  }

  void step(dart.Event event) {
    for (int i = 0; i < 100; i++) {
        universe.simulateStep();
    }
    draw();
    updateStats();
  }

  void updateStats() {
    stepCountElement.innerHTML = universe.stepCount.toString();
    distanceElement.innerHTML = '.' + (10000*universe.averageDistance()).floor();
  }
  
  void start(dart.Event event) {
    stop(event);
    interval = dart.window.setInterval(() => step(null), 500);
  }

  void stop(dart.Event event) {
    if (interval != null) {
        dart.window.clearInterval(interval);
        interval = null;
    }
  }
  
  void run() {
    universe = new Universe();
    stepCountElement = dart.document.query('#step-count');
    distanceElement = dart.document.query('#distance');
    canvas = dart.document.query('#mikado-canvas');
    
    draw();
    
    updateStats();
    
    dart.document.query('#start-button').on.click.add(start);
    dart.document.query('#stop-button').on.click.add(stop);
    dart.document.query('#step-button').on.click.add(step);
    
  }
}

void main() {
  Test test = new Test();
  test.runTests();
  test.reportResults();
  
  new Mikado().run();
}
