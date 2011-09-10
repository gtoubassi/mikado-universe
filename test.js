
//  Poor man's unit testing
//
// To run, install v8 (including the shell):
//
// % echo 'runTests();' | shell --shell mikado.js test.js
//
// To profile
//
// % echo 'simulate(100000);' | shell --prof --shell mikado.js test.js
// % ./tools/mac-tick-processor v8.log


var successCount = 0;
var failureCount = 0;
var totalCount = 0;

function testLog(message) {
    print(message);
}

function assertTrue(flag, message) {
    totalCount++;
    if (flag) {
        successCount++;
    }
    else {
        failureCount++;
        testLog('failure: ' + message);
    }
}

function reportResults() {
    testLog(failureCount + ' failures');
    testLog(totalCount + ' tests');
}

function testPoint() {
    var p = new Point(1, 2);
    assertTrue(p.x == 1, "x property");
    assertTrue(p.y == 2, "y property");

    var p2 = new Point(5, 2);
    assertTrue(p.distanceSquaredToPoint(p2) == 16, 'distance squared to point');
    assertTrue(p.distanceToPoint(p2) == 4, 'distance to point');

    var s = new Segment(new Point(0, 0), new Point(10, 0));
    assertTrue(p.distanceToSegment(s) == 2, 'distance to segment');
    var s = new Segment(new Point(0, 0), new Point(10, 10));
    assertTrue(p.distanceToSegment(s) == Math.sqrt(2)/2, 'distance to segment 2');
}

function testCircle() {
    var c = new Circle(new Point(1, 1), 1);
    var s = new Segment(new Point(0, 0), new Point(10, 10));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 1');

    var s = new Segment(new Point(0, 0), new Point(10, 0));
    assertTrue(!c.intersectsSegment(s), 'intersectsSegment 2');

    var s = new Segment(new Point(0, 0), new Point(10, .1));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 3');

    var s = new Segment(new Point(0, 0), new Point(.5, .5));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 4');

    var s = new Segment(new Point(.8, .8), new Point(1, 1));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 5');
}

function testSegment() {
    var s1 = new Segment(new Point(0, 0), new Point(1, 1));
    var s2 = new Segment(new Point(0, .2), new Point(10, .2));
    var p = s1.intersectsSegment(s2);
    assertTrue(p != null && p.x == .2 && p.y == .2, 'segment intersects segment 1');
    
    var s2 = new Segment(new Point(0, .2), new Point(-10, .2));
    var p = s1.intersectsSegment(s2);
    assertTrue(p == null, 'segment intersects segment 2');
    
    var s2 = new Segment(new Point(.5, .5), new Point(.6, .5));
    var p = s1.intersectsSegment(s2);
    assertTrue(p != null && p.x == .5 && p.y == .5, 'segment intersects segment 3');
    
    var s2 = new Segment(new Point(1, 0), new Point(0, 1));
    var p = s1.intersectsSegment(s2);
    assertTrue(p != null && p.x == .5 && p.y == .5, 'segment intersects segment 4');
    
    var s2 = new Segment(new Point(1, 0), new Point(2, 1));
    var p = s1.intersectsSegment(s2);
    assertTrue(p == null, 'segment intersects segment 5');
    
    var p = s1.intersectsSegment(s1);
    assertTrue(p == null, 'segment intersects segment 6');
    
    var s2 = new Segment(new Point(0, 10), new Point(10, 0));
    var p = s1.intersectsSegment(s2);
    assertTrue(p == null, 'segment intersects segment 7');
}

function testPolygon() {
    var segments = new Array();
    segments.push(new Segment(new Point(1, 0), new Point(0, 1)));
    segments.push(new Segment(new Point(0, 1), new Point(1, 2)));
    segments.push(new Segment(new Point(1, 2), new Point(2, 1)));
    segments.push(new Segment(new Point(2, 1), new Point(1, 0)));
    var poly = new Polygon(segments);

    var p = poly.centroid();
    assertTrue(p.x == 1 && p.y == 1, 'centroid');

    var s = new Segment(new Point(1, 0), new Point(1, 2));
    var split = poly.split(s);
    assertTrue(split != null, 'split 1');
    assertTrue(split[0].centroid().x == 4/3 && split[0].centroid().y == 1, 'split 2');
    assertTrue(split[1].centroid().x == 2/3 && split[1].centroid().y == 1, 'split 3');

    assertTrue(poly.containsPoint(new Point(1, 1)), 'poly.containsPoint 1'); 
    assertTrue(poly.containsPoint(new Point(.1, 1)), 'poly.containsPoint 2'); 
    assertTrue(!poly.containsPoint(new Point(.1, .1)), 'poly.containsPoint 3'); 
    assertTrue(!poly.containsPoint(new Point(1.1, .1)), 'poly.containsPoint 4'); 


    var circle = new Circle(new Point(0, 1), .5);
    assertTrue(poly.intersectsCircle(circle), 'poly intersectsCircle 1'); 

    var circle = new Circle(new Point(-1, 1), .5);
    assertTrue(!poly.intersectsCircle(circle), 'poly intersectsCircle 2'); 
}

function testRectangle() {
    var r = new Rectangle(0, 1, 2, 3);
    assertTrue(r.left == 0, 'ctor 1');
    assertTrue(r.bottom == 1, 'ctor 2');
    assertTrue(r.top == 3, 'ctor 3');
    assertTrue(r.right == 2, 'ctor 4');

    r.expand(1, 1);
    assertTrue(r.left == 0, 'ctor 5');
    assertTrue(r.bottom == 1, 'ctor 6');
    assertTrue(r.top == 3, 'ctor 7');
    assertTrue(r.right == 2, 'ctor 8');

    r.expand(-1, -1);
    assertTrue(r.left == -1, 'ctor 9');
    assertTrue(r.bottom == -1, 'ctor 10');
    assertTrue(r.top == 3, 'ctor 11');
    assertTrue(r.right == 2, 'ctor 12');

    r = new Rectangle(0, 0, 1, 1);
    var r2 = new Rectangle(2, 2, 3, 3);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 1');

    var r2 = new Rectangle(-2, -2, -1, -1);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 2');

    var r2 = new Rectangle(10, 0, 11, 1);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 3');

    var r2 = new Rectangle(-10, 0, -9, 1);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 4');

    var r2 = new Rectangle(0, 10, 1, 11);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 5');

    var r2 = new Rectangle(0, -10, 1, -9);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 6');

    var r2 = new Rectangle(.2, .2, .6, .6);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    var r2 = new Rectangle(-1, .2, .5, .5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    var r2 = new Rectangle(0, .2, 1.5, .5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    var r2 = new Rectangle(.5, .5, 1.5, 1.5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    var r2 = new Rectangle(.5, .5, -1.5, -1.5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    var r2 = new Rectangle(-10, -10, 10, 10);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');
}


function runTests() {
    testPoint();
    testCircle();
    testRectangle();
    testSegment();
    testPolygon();

    reportResults();
}

function simulate(steps) {
    var universe = new Universe();
    
    var start = (new Date).getTime();
    for (var i = 0; i < steps; i++) {
        universe.simulateStep();
        if (i % 1000 == 0 && i > 1) {
            print(universe.averageDistance() + ' (step ' + universe.stepCount + ')');
        }
    }
    var end = (new Date).getTime();
    print("Duration: " + (end - start) + "ms");
}


