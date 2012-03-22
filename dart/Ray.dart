class Ray {
  Segment segment;
  bool state;
  
  Ray(Segment this.segment) : state = false;
  
  void draw(dart.CanvasRenderingContext2D context) {
    context.save();
    context.strokeStyle = state ? "#222" : "#aaa";
    segment.draw(context);
    context.restore();
  }
  
  
}
