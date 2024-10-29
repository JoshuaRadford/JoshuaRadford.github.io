/***
 * @param {[Point]} points
 * @returns {[Point]} Points within the delaunay triangulation
 */
function triangulate(points)
{
    let pts = points;

    // Sort points by x, then by y
    pts.sort(function (a, b)
    {
        if (a.x === b.x)
        {
            return a.y - b.y;
        }

        return a.x - b.x;
    });

    console.log(`Sorted points: ${pts}`);

    // Remove duplicates
    for (let i = pts.length - 1; i >= 1; i--)
    {
        if (pts[i].x === pts[i - 1].x && pts[i].y === pts[i - 1].y)
        {
            pts.splice(i, 1);
        }
    }

    // base case
    if (pts.length < 2)
    {
        return {};
    }

    let quadEdge = delaunay(pts).edgeOut;

    console.log(`Quad Edge: ${quadEdge}`);

    let faces = [];
    let queueIndex = 0;
    let queue = [quadEdge];

    // Mark outer edges as visited
    while (leftOf(quadEdge.onext.dest, quadEdge))
    {
        quadEdge = quadEdge.onext;
    }

    let current = quadEdge;
    do
    {
        queue.push(current.sym);
        current.mark = true;
        current = current.lnext;
    } while (current !== quadEdge);

    do
    {
        let edge = queue[queueIndex++];
        if (!edge.mark)
        {
            // Stores the edges for a visited triangle. Also pushes sym (neighbor) edges on stack to visit later.
            current = edge;
            do
            {
                faces.push(current.origin);
                if (!current.sym.mark)
                {
                    queue.push(current.sym);
                }
                current.mark = true;
                current = current.lnext;
            } while (current != edge)
        }
    } while (queueIndex < queue.length);

    return faces;
}

/**
 * Perform delaunay triangulation on points
 * 
 * @param {[Point]} points 
 * @returns {QuadEdge} Reference to left and right QuadEdge in triangulation
 */
function delaunay(points)
{
    let a, b, c, temp;

    // base cases
    if (points.length === 2)
    {
        a = makeEdge(points[0], points[1]);
        return {
            edgeOut: a, edgeIn: a.sym
        };
    }
    else if (points.length === 3)
    {
        a = makeEdge(points[0], points[1]);
        b = makeEdge(points[1], points[2]);
        splice(a.sym, b);

        if (ccw(points[0], points[1], points[2]))
        {
            c = connect(b, a);
            return {
                edgeOut: a, edgeIn: b.sym
            };
        }
        else if (ccw(points[0], points[2], points[1]))
        {
            c = connect(b, a);
            return {
                edgeOut: c.sym, edgeIn: c
            };
        }
        else // all 3 points are collinear
        {
            return {
                edgeOut: a, edgeIn: b.sym
            };
        }
    }
    else // number of points is > 4
    {
        let mid = Math.ceil(points.length / 2);
        let left = delaunay(points.slice(0, mid));
        let right = delaunay(points.slice(mid));

        let leftDelaunayOut = left.edgeOut,
            leftDelaunayIn = left.edgeIn,
            rightDelaunayIn = right.edgeOut,
            rightDelaunaOut = right.edgeIn;

        // find lower common tangent of left and right
        do
        {
            if (leftOf(rightDelaunayIn.origin, leftDelaunayIn))
            {
                leftDelaunayIn = leftDelaunayIn.lnext;
            }
            else if (rightOf(leftDelaunayIn.origin, rightDelaunayIn))
            {
                rightDelaunayIn = rightDelaunayIn.rprev;
            }
            else
            {
                break;
            }
        } while (true);

        // define base
        let base = connect(rightDelaunaOut.sym, leftDelaunayIn);

        if (leftDelaunayIn.origin === leftDelaunayOut.origin)
        {
            leftDelaunayOut = base.sym;
        }
        if (rightDelaunayIn.origin === rightDelaunaOut.origin)
        {
            rightDelaunaOut = base;
        }

        // merge
        do
        {
            // Locate the first L point to be encountered by the rising bubble, delete L edges out of base destination that fail the circle test.
            let leftCandidate = base.sym.onext;
            if (valid(leftCandidate, base))
            {
                while (inCircle(base.dest, base.origin, leftCandidate.dest, leftCandidate.onext.dest))
                {
                    temp = leftCandidate.onext;
                    deleteEdge(leftCandidate)
                    leftCandidate = temp;
                }
            }

            // Symmetrically, locate the first R point to be hit, and delete R edges
            let rightCandidate = base.oprev;
            if (valid(rightCandidate, base))
            {
                while (inCircle(base.dest, base.origin, rightCandidate.dest, rightCandidate.oprev.dest))
                {
                    temp = rightCandidate.oprev;
                    deleteEdge(rightCandidate);
                    rightCandidate = temp;
                }
            }

            // If both candidates are invalid, then base is the upper common tangent
            if (!valid(leftCandidate, base) && !valid(rightCandidate, base))
            {
                break;
            }

            // The next cross edge is to be connected to either leftCandidate.dest or rightCandidate.dest
            // If both are valid, then choose the appropriate one using the circle test
            if (!valid(leftCandidate, base) || (valid(rightCandidate, base) && inCircle(leftCandidate.dest, leftCandidate.origin, rightCandidate.origin, rightCandidate.dest)))
            {
                base = connect(rightCandidate, base.sym);
            }
            else
            {
                base = connect(base.sym, leftCandidate.sym);
            }
        } while (true);

        return {
            edgeOut: leftDelaunayOut, edgeIn: rightDelaunaOut
        };
    }
}

/**
 * 
 * @param {point} origin 
 * @param {point} destination 
 * @returns 
 */
function makeEdge(origin, destination)
{
    let q0 = new QuadEdge(null, null, origin),
        q1 = new QuadEdge(null, null, null),
        q2 = new QuadEdge(null, null, destination),
        q3 = new QuadEdge(null, null, null);

    q0.onext = q0; q2.onext = q2;
    q1.onext = q3; q3.onext = q1;

    q0.rot = q1;
    q1.rot = q2;
    q2.rot = q3;
    q3.rot = q0;

    return q0;
}

/**
 * Attach/detach the two edges = combine/split the two rings in the dual space
 * 
 * @param {QuadEdge} a 
 * @param {QuadEdge} b 
 */
function splice(a, b)
{
    let alpha = a.onext.rot,
        beta = b.onext.rot;

    let t2 = a.onext,
        t3 = beta.onext,
        t4 = alpha.onext;

    a.onext = b.onext;
    b.onext = t2;
    alpha.onext = t3;
    beta.onext = t4;
}

/**
 * Create a new QuadEdge by connecting two QuadEdges
 * 
 * @param {QuadEdge} a 
 * @param {QuadEdge} b
 * @returns Merged QuadEdge
 */
function connect(a, b)
{
    let q = makeEdge(a.dest, b.origin);
    splice(q, a.lnext);
    splice(q.sym, b);
    return q;
}

/**
 * Effectively delete QuadEdge by splicing itself with its cw neighbor and splicing its inverse with the cw neighbor of its inverse
 * 
 * @param {QuadEdge} q 
 */
function deleteEdge(q)
{
    splice(q, q.oprev);
    splice(q.sym, q.sym.oprev)
}

function QuadEdge(onext, rot, origin)
{
    this.onext = onext; // QuadEdge
    this.rot = rot; // QuadEdge
    this.origin = origin; // point
    this.mark = false;

    this.toString = function ()
    {
        return `O(${origin}) -> ${onext}`;
    };
}

QuadEdge.prototype = {
    get sym() { return this.rot.rot; },
    get dest() { return this.sym.origin; },
    get tor() { return this.rot.rot.rot; },
    get oprev() { return this.rot.onext.rot; }, // around origin cw
    get dprev() { return this.tor.onext.tor; }, // around dest cw
    get lnext() { return this.tor.onext.rot; }, // next ccw edge in left face
    get rprev() { return this.sym.onext; } // next ccw edge in right face
}

function Point(x, y)
{
    this.x = x;
    this.y = y;

    this.toString = function ()
    {
        return `(${this.x}, ${this.y})`;
    }
}

// --Utils--
/**
 * 
 * @param {Point} a 
 * @param {Point} b 
 * @param {Point} c 
 * @returns {boolean} True if *a* is ccw with respect to segment *b->c*
 */
function ccw(a, b, c)
{
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
}

/**
 * 
 * @param {Point} x 
 * @param {QuadEdge} e 
 * @returns {boolean} True if *x* is right of QuadEdge *e*
 */
function rightOf(x, e)
{
    return ccw(x, e.dest, e.origin);
}

/**
 * 
 * @param {Point} x 
 * @param {QuadEdge} e 
 * @returns {boolean} True if *x* is left of QuadEdge *e*
 */
function leftOf(x, e)
{
    return ccw(x, e.origin, e.dest)
}

/**
 * 
 * @param {QuadEdge} e 
 * @param {QuadEdge} basel 
 * @returns {boolean} True if QuadEdge *e*'s destination is right of QuadEdge *basel*
 */
function valid(e, basel)
{
    return rightOf(e.dest, basel)
}

/**
 * Computes this 4x4 matrix's determinant:
 * 
 * [[ a.x, a.y, a.x²+a.y², 1 ], [ b.x, b.y, b.x²+b.y², 1 ], [ c.x, c.y, c.x²+c.y², 1 ], [ d.x d.y d.x²+d.y² 1 ]]
 * 
 * @param {Point} a 
 * @param {Point} b 
 * @param {Point} c 
 * @param {Point} d 
 * @returns {boolean} True if d is in the circumference of a, b, c.
 */
function inCircle(a, b, c, d)
{
    if ((a.x === d.x && a.y === d.y)
        || (b.x === d.x && b.y === d.y)
        || (c.x === d.x && c.y === d.y))
    {
        return false;
    }

    let sa = a.x * a.x + a.y * a.y,
        sb = b.x * b.x + b.y * b.y,
        sc = c.x * c.x + c.y * c.y,
        sd = d.x * d.x + d.y * d.y;
    let d1 = sc - sd,
        d2 = c.y - d.y,
        d3 = c.y * sd - sc * d.y,
        d4 = c.x - d.x,
        d5 = c.x * sd - sc * d.x,
        d6 = c.x * d.y - c.y * d.x;
    let determinant =
        (a.x * ((b.y * d1) - (sb * d2) + d3)) -
        (a.y * (b.x * d1 - (sb * d4) + d5)) +
        (sa * ((b.x * d2) - (b.y * d4) + d6)) -
        (b.x * d3) +
        (b.y * d5) -
        (sb * d6);
    return determinant > 1;
}


export { triangulate, Point };