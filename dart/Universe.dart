class Universe {
  Polygon bounds;
  int stepCount = 0;
  List<Particle> particles;
  List<Ray> rays;
  
  Universe() {
    particles = new List<Particle>();
    
    List<Segment> segments = new List<Segment>();
    
    segments.add(new Segment(new Point(0.0, 0.0), new Point(0.0, 1.0)));
    segments.add(new Segment(new Point(0.0, 1.0), new Point(1.0, 1.0)));
    segments.add(new Segment(new Point(1.0, 1.0), new Point(1.0, 0.0)));
    segments.add(new Segment(new Point(1.0, 0.0), new Point(0.0, 0.0)));
    
    bounds = new Polygon(segments);
    
    particles.add(new Particle(new Circle(new Point(.2, .2), .11), bounds));
    particles.add(new Particle(new Circle(new Point(.8, .8), .12), bounds));
    particles.add(new Particle(new Circle(new Point(.2, .8), .13), bounds));
    particles.add(new Particle(new Circle(new Point(.8, .2), .14), bounds));
    
    rays = new List<Ray>();
    
    for (int i = 0; i < segments.length; i++) {
      Ray ray = new Ray(segments[i]);
      ray.state = true;
      rays.add(ray);
    }
    
    for (int i = 0; i < 200; i++) {
      Ray ray = generateRay();
      bool hitsParticles = false;
      for (int j = 0; j < particles.length; j++) {
          hitsParticles = hitsParticles || particles[j].intersectsSegment(ray.segment);
      }
      
      if (!hitsParticles && Math.random() > .5) {
        ray.state = true;
      }
      
      rays.add(ray);
    }
    
    computeParticleBoundingPolygons();
  }
  
  Ray generateRay() {
    double x = Math.random();
    double y = Math.random();
    double rad = Math.PI * Math.random();
    Point point1 = new Point(x + 2 * Math.cos(rad), y + 2 * Math.sin(rad));
    Point point2 = new Point(x - 2 * Math.cos(rad), y - 2 * Math.sin(rad));
    return new Ray(new Segment(point1, point2));
  }

  void computeParticleBoundingPolygons() {
    for (Particle particle in particles) {
        particle.computeBoundingPolygon(bounds, rays);
    }
  }
  
  void simulateStep() {
    stepCount++;
    int rayIndex = bounds.segments.length + (Math.random() * (rays.length - bounds.segments.length)).floor().toInt();
    Ray ray = rays[rayIndex];

    if (ray.state) {
      ray.state = false;
    }
    else {

      computeParticleBoundingPolygons();
  
      List<Particle> newParticles = new List<Particle>();
      
      for (Particle p in particles) {
        Particle newParticle = p.particleMovedBySegment(ray.segment);
        if (newParticle == null) {
          break;
        }
        newParticles.add(newParticle);
      }        

      if (newParticles.length == particles.length) {
        particles = newParticles;
        ray.state = true;
      }
    }
  }
  
  double averageDistance() {
    int count = 0;
    double distance = 0.0;
    for (int i = 0; i < particles.length; i++) {
      for (int j = i + 1; j < particles.length; j++) {
        count++;
        distance += particles[i].circle.center.distanceToPoint(particles[j].circle.center);
      }
    }

    return distance/count;
  }

  void draw(dart.CanvasRenderingContext2D context) {
    context.fillStyle = "white";
    context.fillRect(-1,-1,2,2);

    context.strokeStyle = "black";
    context.lineWidth = .005;
    bounds.draw(context);
    
    for (Ray ray in rays) {
      if (!ray.state) {
          ray.draw(context);
      }
    }
    for (Ray ray in rays) {
      if (ray.state) {
          ray.draw(context);
      }
    }

    for (Particle p in particles) {
      p.draw(context);
    }
    
  }

}
