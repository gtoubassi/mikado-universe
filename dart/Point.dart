class Point {
  
  double x, y;
  
  Point(this.x, this.y);
  
  String toString() {
    return "${x},${y}";
  }
  
  double distanceSquaredToPoint(Point point) {
    double dx = x - point.x;
    double dy = y - point.y;
    return dx * dx + dy * dy;
  }
  
  double distanceToPoint(Point point) {
    return Math.sqrt(distanceSquaredToPoint(point));
  }
  
}
