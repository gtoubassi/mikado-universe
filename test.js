
//  Poor man's unit testing
//
// To run, install v8 (including the shell):
//
// % echo 'runTests();' | ./shell --shell mikado.js test.js


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


function runTests() {
    testPoint();
    testCircle();
    testSegment();
    testPolygon();

    reportResults();
}

