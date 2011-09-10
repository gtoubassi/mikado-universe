

////////////////////////////////////////////////
// Point - Simple 2D point with x, y properties
////////////////////////////////////////////////

function Point(x,y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return this.x + ',' + this.y;
}

Point.prototype.distanceToSegment = function(segment) {
    // see http://paulbourke.net/geometry/pointline/

    var p1 = segment.point1;
    var p2 = segment.point2;
    var p3 = this;

    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var x3 = this.x;
    var y3 = this.y;

    var dSquared = p1.distanceSquaredToPoint(p2);

    if (dSquared == 0) {
        return this.distanceToPoint(p1);
    }

    var u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / dSquared;
    
    var x = x1 + u * (x2 - x1);
    var y = y1 + u * (y2 - y1);


    var perpendicularDistance = this.distanceToPoint(new Point(x, y));

    if (u >= 0 && u <= 1) {
        return perpendicularDistance;
    }

    var distancePoint1 = this.distanceToPoint(p1);
    var distancePoint2 = this.distanceToPoint(p2);
    
    return Math.min(distancePoint1, distancePoint2);
}

Point.prototype.distanceToPoint = function(point) {
    return Math.sqrt(this.distanceSquaredToPoint(point));
}

Point.prototype.distanceSquaredToPoint = function(point) {
    var dx = this.x - point.x;
    var dy = this.y - point.y;
    return dx * dx + dy * dy;
}



////////////////////////////////////////////////
// Circle - center (Point), and radius properties
////////////////////////////////////////////////
function Circle(center, radius) {
    this.center = center;
    this.radius = radius;
}

Circle.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI, false);
    context.stroke();
}

// A segment entirely inside the circle is considered intersecting
// A segment that is merely tangent does not intersect.
Circle.prototype.intersectsSegment = function(segment) {
    var d = this.center.distanceToSegment(segment);
    return d < this.radius ? true : false;
}




////////////////////////////////////////////////
// Segment - A line segment joining point1 (Point) and point2 (Point)
////////////////////////////////////////////////

function Segment(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
}

Segment.prototype.draw = function(context) {
    context.beginPath();
    context.moveTo(this.point1.x, this.point1.y);
    context.lineTo(this.point2.x, this.point2.y);
    context.stroke();
}

Segment.prototype.isEmpty = function() {
    return this.point1.x == this.point2.x && this.point1.y == this.point2.y;
}

// Parallel or coincident lines return null
Segment.prototype.intersectsSegment = function(segment) {
    // See http://paulbourke.net/geometry/lineline2d/

    var p1 = this.point1;
    var p2 = this.point2;
    var p3 = segment.point1;
    var p4 = segment.point2;

    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var x3 = p3.x;
    var y3 = p3.y;
    var x4 = p4.x;
    var y4 = p4.y;

    var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (denominator == 0) {
        // The lines are parallel or coincident
        return null;
    }

    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1) {
        return null;
    }

    var x = x1 + ua * (x2 - x1);
    var y = y1 + ua * (y2 - y1);

    return new Point(x, y);
}

Segment.prototype.toString = function() {
    return '[' + this.point1.toString() + ' ' + this.point2.toString() + ']';
}




//////////////////////////////////////////////////////////////
// Polygon - An array of Segments with overlapping end points
//////////////////////////////////////////////////////////////

function Polygon(segments) {
    this.segments = segments;
}

Polygon.prototype.draw = function(context) {
    context.beginPath();
    for (var i = 0; i < this.segments.length; i++) {
        context.moveTo(this.segments[i].point1.x, this.segments[i].point1.y);
        context.lineTo(this.segments[i].point2.x, this.segments[i].point2.y);
    }
    context.stroke();
}

Polygon.prototype.split = function(segment) {
    var firstHitIndex = -1;
    var firstHitPoint = null;

    for (var i = 0; i < this.segments.length; i++) {
        var p = this.segments[i].intersectsSegment(segment);
        if (p != null) {
            if (firstHitIndex == -1) {
                firstHitIndex = i;
                firstHitPoint = p;
            }
            else {
                
                var segments = new Array();
                for (var j = 0; j < firstHitIndex; j++) {
                    segments.push(this.segments[j]);
                } 
                segments.push(new Segment(this.segments[firstHitIndex].point1, firstHitPoint));
                segments.push(new Segment(firstHitPoint, p));
                segments.push(new Segment(p, this.segments[i].point2));
                for (var j = i + 1; j < this.segments.length; j++) {
                    segments.push(this.segments[j]);
                }

                segments = segments.filter(function(s) {return !s.isEmpty();});

                var polygons = new Array();
                polygons.push(new Polygon(segments));

                segments = new Array();
                segments.push(new Segment(firstHitPoint, this.segments[firstHitIndex].point2));
                for (var j = firstHitIndex + 1; j < i; j++) {
                    segments.push(this.segments[j]);
                }
                segments.push(new Segment(this.segments[i].point1, p));
                segments.push(new Segment(p, firstHitPoint));
                
                segments = segments.filter(function(s) {return !s.isEmpty();});
                polygons.push(new Polygon(segments));

                return polygons;
            }
        }
    }
    return null;
}

Polygon.prototype.intersectsCircle = function(circle) {
    for (var i = 0; i < this.segments.length; i++) {
        if (circle.intersectsSegment(this.segments[i])) {
            return true;
        }
    }
    return false;
}

Polygon.prototype.containsPoint = function(point) {
    var minX = Math.min(this.segments[0].point1.x, this.segments[0].point2.x);
    var maxX = Math.max(this.segments[0].point1.x, this.segments[0].point2.x);

    for (var i = 1; i < this.segments.length; i++) {
        minX = Math.min(minX, Math.min(this.segments[i].point1.x, this.segments[i].point2.x));
        maxX = Math.max(maxX, Math.max(this.segments[i].point1.x, this.segments[i].point2.x));
    }

    var leftSegment = new Segment(new Point(minX - 1, point.y), point);
    var found = false;
    for (var i = 0; i < this.segments.length; i++) {
        if (this.segments[i].intersectsSegment(leftSegment) != null) {
            found = true;
            break;
        }
    }

    if (!found) {
        return false;
    }

    var rightSegment = new Segment(point, new Point(maxX + 1, point.y));
    found = false;
    for (var i = 0; i < this.segments.length; i++) {
        if (this.segments[i].intersectsSegment(rightSegment) != null) {
            found = true;
            break;
        }
    }

    return found;
}

Polygon.prototype.centroid = function() {
    var tx = 0;
    var ty = 0;

    for (var i = 0; i < this.segments.length; i++) {
        tx += this.segments[i].point1.x;
        ty += this.segments[i].point1.y;
    }

    return new Point(tx / this.segments.length, ty / this.segments.length);
}


Polygon.prototype.toString = function() {
    var s = '';
    for (var i = 0; i < this.segments.length; i++) {
        if (s.length > 0) {
            s += ' ';
        }
        s += this.segments[i].toString();
    }
    return s;
}


function PolygonTest() {
    var segments = new Array();
    segments.push(new Segment(new Point(0, 0), new Point(0, 1)));
    segments.push(new Segment(new Point(0, 1), new Point(1, 1)));
    segments.push(new Segment(new Point(1, 1), new Point(1, 0)));
    segments.push(new Segment(new Point(1, 0), new Point(0, 0)));
    var poly1 = new Polygon(segments);

    console.log(poly1.containsPoint(new Point(.1, .2)));

    var split = poly1.split(new Segment(new Point(.5, 0), new Point(.5, 1)));
    split.forEach(function(poly) {
        console.log(poly.toString());
    });
}





//////////////////////////////////////////////////////////////
// Particle - A circle defining the particle and its enclosing polygon (defined by rays)
//////////////////////////////////////////////////////////////

function Particle(circle, polygon) {
    this.circle = circle;
    var points = new Array();
    this.polygon = polygon;
}

Particle.prototype.draw = function(context) {
    context.save();
    context.strokeStyle = "red";
    this.circle.draw(context);
    context.strokeStyle = "blue";
    this.polygon.draw(context);
    context.restore();
}

Particle.prototype.intersectsSegment = function(segment) {
    return this.circle.intersectsSegment(segment);
}


Particle.prototype.refineBoundingPolygon = function(segment) {
    if (this.intersectsSegment(segment)) {
        return false;
    }

    var polygons = this.polygon.split(segment);
    if (polygons == null) {
        return true;
    }

    if (polygons[0].containsPoint(this.circle.center)) {
        this.polygon = polygons[0];
    }
    else {
        this.polygon = polygons[1];
    }
    return true;
}

Particle.prototype.moveForSegment = function(segment, mutate) {
    if (this.intersectsSegment(segment)) {
        return false;
    }

    var polygons = this.polygon.split(segment);
    if (polygons == null) {
        return true;
    }

    for (var i = 0; i < polygons.length; i++) {
        var newCenter = polygons[i].centroid();
        var newCircle = new Circle(newCenter, this.circle.radius);
        if (!polygons[i].intersectsCircle(newCircle)) {
            if (mutate) {
                this.polygon = polygons[i];
                this.circle = newCircle;
            }
            return true;
        }
    }

    return false;
}


function ParticleTest() {
    var segments = new Array();
    segments.push(new Segment(new Point(0, 0), new Point(0, 1)));
    segments.push(new Segment(new Point(0, 1), new Point(1, 1)));
    segments.push(new Segment(new Point(1, 1), new Point(1, 0)));
    segments.push(new Segment(new Point(1, 0), new Point(0, 0)));
    var poly1 = new Polygon(segments);

    var particle = new Particle(new Circle(new Point(.5, .5), .1), poly1);
    console.log(particle.polygon.toString());

    console.log(particle.refineBoundingPolygon(new Segment(new Point(.2, 0), new Point(.2, 1))));

    console.log(particle.polygon.toString());

}



//////////////////////////////////////////////////////////////
// Ray - A ray in our universe from which space emerges: a segment (Segment) + state (boolean)
//////////////////////////////////////////////////////////////

function Ray(segment) {
    this.segment = segment;
    this.state = false;
}

Ray.prototype.draw = function(context) {
    context.save();
    context.strokeStyle = this.state ? "#222" : "#aaa";
    this.segment.draw(context);
    context.restore();
}




//////////////////////////////////////////////////////////////
// Universe - 2 particles and a set of rays (Segments) as well as a bounding polygon
//////////////////////////////////////////////////////////////
function Universe() {
    this.stepCount = 0;
    this.particles = new Array();
    var segments = new Array();
    segments.push(new Segment(new Point(0, 0), new Point(0, 1)));
    segments.push(new Segment(new Point(0, 1), new Point(1, 1)));
    segments.push(new Segment(new Point(1, 1), new Point(1, 0)));
    segments.push(new Segment(new Point(1, 0), new Point(0, 0)));
    this.bounds = new Polygon(segments);
    this.particles.push(new Particle(new Circle(new Point(.2, .2), .11), this.bounds));
    this.particles.push(new Particle(new Circle(new Point(.8, .8), .12), this.bounds));
    this.particles.push(new Particle(new Circle(new Point(.2, .8), .13), this.bounds));
    this.particles.push(new Particle(new Circle(new Point(.8, .2), .14), this.bounds));

    this.rays = new Array();

    for (var i = 0; i < 200; i++) {
        var ray = this.generateRay();

        var hitsParticles = false;
        for (var j = 0; j < this.particles.length; j++) {
            hitsParticles = hitsParticles || this.particles[j].intersectsSegment(ray.segment);
        }

        if (!hitsParticles && Math.random() > .50) {
            ray.state = true;
        }

        this.rays.push(ray);
    }

    this.refineParticleBoundingPolygons();
}

Universe.prototype.generateRay = function() {
    var x = Math.random();
    var y = Math.random();
    var rad = Math.PI * Math.random();
    var point1 = new Point(x + 2 * Math.cos(rad), y + 2 * Math.sin(rad));
    var point2 = new Point(x - 2 * Math.cos(rad), y - 2 * Math.sin(rad));
    return new Ray(new Segment(point1, point2));
}

Universe.prototype.simulateStep = function() {
    this.stepCount++;
    var rayIndex = Math.floor(Math.random() * this.rays.length);
    var ray = this.rays[rayIndex];

    if (ray.state) {
        ray.state = false;
    }
    else {

        this.refineParticleBoundingPolygons();

        var success = true;
        for (var i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].moveForSegment(ray.segment, false)) {
                success = false;
                break;
            }
        }        

        if (success) {
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].moveForSegment(ray.segment, true);
            }
            ray.state = true;
        }
    }
}

Universe.prototype.refineParticleBoundingPolygons = function() {
    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].polygon = this.bounds;
        for (var j = 0; j < this.rays.length; j++) {
            if (this.rays[j].state) {
                this.particles[i].refineBoundingPolygon(this.rays[j].segment);
            }
        }
    }
}

Universe.prototype.averageDistance = function() {
    var count = 0;
    var distance = 0;
    for (var i = 0; i < this.particles.length; i++) {
        for (var j = i + 1; j < this.particles.length; j++) {
            count++;
            distance += this.particles[i].circle.center.distanceToPoint(this.particles[j].circle.center);
        }
    }

    return distance/count;
}




Universe.prototype.draw = function() {
    var canvas = document.getElementById('mikado-canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = "white";
    context.fillRect(0,0,500,500);
    context.save();
    context.scale(400, 400);

    context.strokeStyle = "black";
    context.lineWidth = .005;
    this.bounds.draw(context);

    for (var i = 0; i < this.rays.length; i++) {
        if (!this.rays[i].state) {
            this.rays[i].draw(context);
        }
    }
    for (var i = 0; i < this.rays.length; i++) {
        if (this.rays[i].state) {
            this.rays[i].draw(context);
        }
    }

    for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].draw(context);
    }

    context.restore();
}
