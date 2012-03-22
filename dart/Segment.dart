class Segment {
  
  Point point1;
  Point point2;
  Rectangle _bounds;
  
  Segment(Point this.point1, Point this.point2);

  Rectangle get bounds() {
    if (_bounds == null) {
      _bounds = new Rectangle(point1.x, point1.y, point2.x, point2.y);
    }
    return _bounds;
  }
  
  bool isEmpty() {
    return point1.x == point2.x && point1.y == point2.y;
  }
  
  Point intersectsSegment(Segment segment) {
    if (!bounds.intersectsRect(segment.bounds)) {
      return null;
    }
    
    // See http://paulbourke.net/geometry/lineline2d/

    Point p1 = point1;
    Point p2 = point2;
    Point p3 = segment.point1;
    Point p4 = segment.point2;

    double x1 = p1.x;
    double y1 = p1.y;
    double x2 = p2.x;
    double y2 = p2.y;
    double x3 = p3.x;
    double y3 = p3.y;
    double x4 = p4.x;
    double y4 = p4.y;

    double denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (denominator == 0) {
        // The lines are parallel or coincident
        return null;
    }

    double ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    double ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1) {
        return null;
    }

    double x = x1 + ua * (x2 - x1);
    double y = y1 + ua * (y2 - y1);

    return new Point(x, y);
  }

  String toString() {
    return '[' + point1.toString() + ' ' + point2.toString() + ']';
  }
  
  void draw(dart.CanvasRenderingContext2D context) {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.closePath();
    context.stroke();
  }
  
  double distanceToPoint(Point point) {
    // see http://paulbourke.net/geometry/pointline/

    Point p1 = point1;
    Point p2 = point2;

    double x1 = p1.x;
    double y1 = p1.y;
    double x2 = p2.x;
    double y2 = p2.y;
    double x3 = point.x;
    double y3 = point.y;

    double dSquared = p1.distanceSquaredToPoint(p2);

    if (dSquared == 0) {
      return point.distanceToPoint(p1);
    }

    double u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / dSquared;

    var perpendicularDistance = point.distanceToPoint(new Point(x1 + u * (x2 - x1), y1 + u * (y2 - y1)));

    if (u >= 0 && u <= 1) {
        return perpendicularDistance;
    }

    return Math.min(point.distanceToPoint(p1), point.distanceToPoint(p2));
  }

}
