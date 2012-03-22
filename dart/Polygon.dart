class Polygon {
  List<Segment> segments;
  
  Polygon(List<Segment> this.segments);
  
  void draw(dart.CanvasRenderingContext2D context) {
    context.beginPath();
    for (Segment segment in segments) {
      context.moveTo(segment.point1.x, segment.point1.y);
      context.lineTo(segment.point2.x, segment.point2.y);
    }
    context.closePath();
    context.stroke();
  }
  
  List<Polygon> split(Segment segment) {
    int firstHitIndex = -1;
    Point firstHitPoint = null;

    for (int i = 0; i < segments.length; i++) {
        Point p = segments[i].intersectsSegment(segment);
        if (p != null) {
            if (firstHitIndex == -1) {
                firstHitIndex = i;
                firstHitPoint = p;
            }
            else {
                
                List<Segment> newSegments = [];
                for (int j = 0; j < firstHitIndex; j++) {
                    newSegments.add(segments[j]);
                } 
                newSegments.add(new Segment(segments[firstHitIndex].point1, firstHitPoint));
                newSegments.add(new Segment(firstHitPoint, p));
                newSegments.add(new Segment(p, segments[i].point2));
                for (int j = i + 1; j < segments.length; j++) {
                  newSegments.add(segments[j]);
                }

                newSegments = newSegments.filter((s) => !s.isEmpty());

                List<Polygon> polygons = [];
                polygons.add(new Polygon(newSegments));

                newSegments = [];
                newSegments.add(new Segment(firstHitPoint, segments[firstHitIndex].point2));
                for (int j = firstHitIndex + 1; j < i; j++) {
                    newSegments.add(segments[j]);
                }
                newSegments.add(new Segment(segments[i].point1, p));
                newSegments.add(new Segment(p, firstHitPoint));
                
                newSegments = newSegments.filter((s) => !s.isEmpty());
                polygons.add(new Polygon(newSegments));

                return polygons;
            }
        }
    }
    return null;
  }

  bool intersectsCircle(Circle circle) {
    for (Segment s in segments) {
      if (circle.intersectsSegment(s)) {
        return true;
      }
    }
    return false;
  }
   
   
  bool containsPoint(Point point) {
    double minX = Math.min(segments[0].point1.x, segments[0].point2.x);
    double maxX = Math.max(segments[0].point1.x, segments[0].point2.x);

    for (int i = 1; i < segments.length; i++) {
      minX = Math.min(minX, Math.min(segments[i].point1.x, segments[i].point2.x));
      maxX = Math.max(maxX, Math.max(segments[i].point1.x, segments[i].point2.x));
    }

    Segment leftSegment = new Segment(new Point(minX - 1, point.y), point);
    bool found = false;
    for (Segment s in segments) {
      if (s.intersectsSegment(leftSegment) != null) {
        found = true;
        break;
      }
    }

    if (!found) {
      return false;
    }

    Segment rightSegment = new Segment(point, new Point(maxX + 1, point.y));
    found = false;
    for (Segment s in segments) {
      if (s.intersectsSegment(rightSegment) != null) {
        found = true;
        break;
      }
    }

    return found;
  }
  
  Point centroid() {
    double tx = 0.0;
    double ty = 0.0;

    for (Segment s in segments) {
        tx += s.point1.x;
        ty += s.point1.y;
    }

    return new Point(tx / segments.length, ty / segments.length);
  }
  
  String toString() {
    String buf = '';
    for (Segment s in segments) {
      if (buf.length > 0) {
        buf += ' ';
      }
      buf += s.toString();
    }
    return buf;
  }

}
