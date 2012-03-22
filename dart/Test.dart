class Test {
  
  int successCount = 0;
  int failureCount = 0;
  int totalCount = 0;

  void testLog(String message) {
    print(message);
  }

  void assertTrue(bool flag, String message) {
    totalCount++;
    if (flag) {
      successCount++;
    }
    else {
      failureCount++;
      testLog('failure: ' + message);
    }
  }

  void reportResults() {
    testLog(failureCount.toString() + ' failures');
    testLog(totalCount.toString() + ' tests');
  }
  
  void runTests() {
    testPoint();
    testCircle();
    testSegment();
    testPolygon();
    testRectangle();
  }

  void testRectangle() {
    Rectangle r = new Rectangle(0.0, 1.0, 2.0, 3.0);
    assertTrue(r.left == 0, 'ctor 1');
    assertTrue(r.bottom == 1, 'ctor 2');
    assertTrue(r.top == 3, 'ctor 3');
    assertTrue(r.right == 2, 'ctor 4');

    r.expand(1.0, 1.0);
    assertTrue(r.left == 0, 'ctor 5');
    assertTrue(r.bottom == 1, 'ctor 6');
    assertTrue(r.top == 3, 'ctor 7');
    assertTrue(r.right == 2, 'ctor 8');

    r.expand(-1.0, -1.0);
    assertTrue(r.left == -1, 'ctor 9');
    assertTrue(r.bottom == -1, 'ctor 10');
    assertTrue(r.top == 3, 'ctor 11');
    assertTrue(r.right == 2, 'ctor 12');

    r = new Rectangle(0.0, 0.0, 1.0, 1.0);
    Rectangle r2 = new Rectangle(2.0, 2.0, 3.0, 3.0);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 1');

    r2 = new Rectangle(-2.0, -2.0, -1.0, -1.0);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 2');

    r2 = new Rectangle(10.0, 0.0, 11.0, 1.0);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 3');

    r2 = new Rectangle(-10.0, 0.0, -9.0, 1.0);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 4');

    r2 = new Rectangle(0.0, 10.0, 1.0, 11.0);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 5');

    r2 = new Rectangle(0.0, -10.0, 1.0, -9.0);
    assertTrue(!r.intersectsRect(r2), 'intersectsRect 6');

    r2 = new Rectangle(.2, .2, .6, .6);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    r2 = new Rectangle(-1.0, .2, .5, .5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    r2 = new Rectangle(0.0, .2, 1.5, .5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    r2 = new Rectangle(.5, .5, 1.5, 1.5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    r2 = new Rectangle(.5, .5, -1.5, -1.5);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');

    r2 = new Rectangle(-10.0, -10.0, 10.0, 10.0);
    assertTrue(r.intersectsRect(r2), 'intersectsRect 7');
  }

  void testSegment() {
    Segment s1 = new Segment(new Point(0.0, 0.0), new Point(1.0, 1.0));
    Segment s2 = new Segment(new Point(0.0, .2), new Point(10.0, .2));
    Point p = s1.intersectsSegment(s2);
    assertTrue(p != null && p.x == .2 && p.y == .2, 'segment intersects segment 1');
    
    s2 = new Segment(new Point(0.0, .2), new Point(-10.0, .2));
    p = s1.intersectsSegment(s2);
    assertTrue(p == null, 'segment intersects segment 2');
    
    s2 = new Segment(new Point(.5, .5), new Point(.6, .5));
    p = s1.intersectsSegment(s2);
    assertTrue(p != null && p.x == .5 && p.y == .5, 'segment intersects segment 3');
    
    s2 = new Segment(new Point(1.0, 0.0), new Point(0.0, 1.0));
    p = s1.intersectsSegment(s2);
    assertTrue(p != null && p.x == .5 && p.y == .5, 'segment intersects segment 4');
    
    s2 = new Segment(new Point(1.0, 0.0), new Point(2.0, 1.0));
    p = s1.intersectsSegment(s2);
    assertTrue(p == null, 'segment intersects segment 5');
    
    p = s1.intersectsSegment(s1);
    assertTrue(p == null, 'segment intersects segment 6');
    
    s2 = new Segment(new Point(0.0, 10.0), new Point(10.0, 0.0));
    p = s1.intersectsSegment(s2);
    assertTrue(p == null, 'segment intersects segment 7');
  }
  
  void testPolygon() {
    List<Segment> segments = new List<Segment>();
    segments.add(new Segment(new Point(1.0, 0.0), new Point(0.0, 1.0)));
    segments.add(new Segment(new Point(0.0, 1.0), new Point(1.0, 2.0)));
    segments.add(new Segment(new Point(1.0, 2.0), new Point(2.0, 1.0)));
    segments.add(new Segment(new Point(2.0, 1.0), new Point(1.0, 0.0)));
    Polygon poly = new Polygon(segments);

    Point p = poly.centroid();
    assertTrue(p.x == 1 && p.y == 1, 'centroid');

    Segment s = new Segment(new Point(1.0, 0.0), new Point(1.0, 2.0));
    List<Polygon> split = poly.split(s);
    assertTrue(split != null, 'split 1');
    assertTrue(split[0].centroid().x == 4/3 && split[0].centroid().y == 1, 'split 2 ${split[0].centroid()}');
    assertTrue(split[1].centroid().x == 2/3 && split[1].centroid().y == 1, 'split 3 ${split[1].centroid()}');

    assertTrue(poly.containsPoint(new Point(1.0, 1.0)), 'poly.containsPoint 1'); 
    assertTrue(poly.containsPoint(new Point(.1, 1.0)), 'poly.containsPoint 2'); 
    assertTrue(!poly.containsPoint(new Point(.1, .1)), 'poly.containsPoint 3'); 
    assertTrue(!poly.containsPoint(new Point(1.1, .1)), 'poly.containsPoint 4'); 


    Circle circle = new Circle(new Point(0.0, 1.0), .5);
    assertTrue(poly.intersectsCircle(circle), 'poly intersectsCircle 1'); 

    circle = new Circle(new Point(-1.0, 1.0), .5);
    assertTrue(!poly.intersectsCircle(circle), 'poly intersectsCircle 2'); 
  }

  void testCircle() {
    Circle c = new Circle(new Point(1.0, 1.0), 1.0);
    Segment s = new Segment(new Point(0.0, 0.0), new Point(10.0, 10.0));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 1');

    s = new Segment(new Point(0.0, 0.0), new Point(10.0, 0.0));
    assertTrue(!c.intersectsSegment(s), 'intersectsSegment 2');

    s = new Segment(new Point(0.0, 0.0), new Point(10.0, .1));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 3');

    s = new Segment(new Point(0.0, 0.0), new Point(.5, .5));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 4');

    s = new Segment(new Point(.8, .8), new Point(1.0, 1.0));
    assertTrue(c.intersectsSegment(s), 'intersectsSegment 5');
  }
  

  void testPoint() {
    Point p = new Point(1.0, 2.0);
    assertTrue(p.x == 1, "x property");
    assertTrue(p.y == 2, "y property");

    Point p2 = new Point(5.0, 2.0);
    assertTrue(p.distanceSquaredToPoint(p2) == 16, 'distance squared to point');
    assertTrue(p.distanceToPoint(p2) == 4, 'distance to point');

    Segment s = new Segment(new Point(0.0, 0.0), new Point(10.0, 0.0));
    assertTrue(s.distanceToPoint(p) == 2, 'distance to segment');
    s = new Segment(new Point(0.0, 0.0), new Point(10.0, 10.0));
    assertTrue(s.distanceToPoint(p) == Math.sqrt(2)/2, 'distance to segment 2');
  }
  
  
}
