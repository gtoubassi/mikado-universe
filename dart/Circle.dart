class Circle {
  
  Point center;
  double radius;
  
  Circle(Point this.center, double this.radius);
  
  bool intersectsSegment(Segment segment) {
    double d = segment.distanceToPoint(center);
    return d < radius;
  }
  
  void draw(dart.CanvasRenderingContext2D context) {
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
    context.stroke();
  }
  
}
