class Particle {
  
  Circle circle;
  Polygon polygon;
  
  Particle(Circle this.circle, Polygon this.polygon);
  
  void draw(dart.CanvasRenderingContext2D context) {
    context.save();
    context.strokeStyle = "red";
    circle.draw(context);
    context.strokeStyle = "blue";
    polygon.draw(context);
    context.restore();
  }
  
  bool intersectsSegment(Segment segment) {
    return circle.intersectsSegment(segment);
  }
  
  void computeBoundingPolygon(Polygon bounds, List<Ray> rays) {

    polygon = bounds;
    
    for (Ray ray in rays) {
      if (ray.state) {

        List<Polygon> polygons = polygon.split(ray.segment);
        if (polygons == null) {
          continue;
        }

        if (polygons[0].containsPoint(circle.center)) {
          polygon = polygons[0];
        }
        else {
          polygon = polygons[1];
        }
      }
    }
  }
  

  Particle particleMovedBySegment(Segment segment) {
    if (intersectsSegment(segment)) {
        return null;
    }

    List<Polygon> polygons = polygon.split(segment);
    if (polygons == null) {
        return this;
    }

    for (Polygon poly in polygons) {
        var newCenter = poly.centroid();
        var newCircle = new Circle(newCenter, circle.radius);
        if (!poly.intersectsCircle(newCircle)) {
            return new Particle(newCircle, poly);
        }
    }

    return null;
  }
  
    
}
