class Rectangle {
  double top, left, bottom, right;
  
  Rectangle(double x1, double y1, double x2, double y2) {
    top = bottom = y1;
    left = right = x1;
    expand(x2, y2);
  }
  
  void expand(double x, double y) {
    if (x < left) {
      left = x;
    }
    else if (x > right) {
      right = x;
    }
    if (y > top) {
      top = y;
    }
    else if (y < bottom) {
      bottom = y;
    }
  }
  
  bool intersectsRect(Rectangle rectangle) {
    if (top < rectangle.bottom || bottom > rectangle.top) {
      return false;
    }
    if (left > rectangle.right || right < rectangle.left) {
      return false;
    }
    return true;
  }
  
}
