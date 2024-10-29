import * as delaunay from "./terraingen_delaunay.js";
import * as del from "./delaunay.js";

function init()
{
    const container = document.getElementById('scene-container');
    let keyMap = new Map();
    const scene = new THREE.Scene();
    let width = 1000;
    let height = 600;
    let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
    let renderer = new THREE.WebGLRenderer();
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    container.appendChild(renderer.domElement);
    renderer.setClearColor(0x333333);
    renderer.setSize(width, height);

    ;

    // Fill mesh
    let vAndI = generateVerticesAndIndices();
    geometry.setAttribute('position', new THREE.BufferAttribute(vAndI.v, 3));
    geometry.setIndex(new THREE.BufferAttribute(vAndI.i, 1));
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    document.addEventListener('keyup', event =>
    {
        if (event.code === 'Space')
        {
            vAndI = generateVerticesAndIndices();
            geometry.setAttribute('position', new THREE.BufferAttribute(vAndI.v, 3));
            geometry.setIndex(new THREE.BufferAttribute(vAndI.i, 1));
            geometry.attributes.position.needsUpdate = true;
            geometry.index.needsUpdate = true;
        }
    })

    let xMax = 600;
    camera.position.set(0, width / 10, height / 4);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    handleCameraKeyPress(camera, keyMap);

    function animate(now)
    {
        handleCameraControl(camera, keyMap);
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function generateVerticesAndIndices(triangles)
{
    var points = [];
    for (let i = 0; i < 100; i++)
    {
        points.push([getRandomValue(-100, 100), getRandomValue(-100, 100)]);
    }
    var dela = new Delaunay(points);
    var triangles = dela.triangulate();
    //console.log(triangles);
    //console.log(dela.depth);
    //console.log(dela.step)

    let vertices = [];
    let indices = [];
    for (let i = 0; i < triangles.length; i++)
    {
        vertices.push(triangles[i][0], 0, triangles[i][1]);
        indices.push(i); // Create a sequential index for each vertex
    }
    vertices = new Float32Array(vertices);
    indices = new Uint16Array(indices);
    console.log(vertices);

    return { v: vertices, i: indices };
}

function Point(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;

    this.toString = function ()
    {
        return `(${x}, ${y}. ${z})`;
    };
}

function getRandomValue(min, max)
{
    return Math.random() * (max - min) + min;
}

function handleCameraKeyPress(camera, keyMap)
{
    document.addEventListener('keydown', function (event)
    {
        keyMap.set(event.key, true);
        if (event.key === "ArrowDown" || event.key === "ArrowUp")
        {
            event.preventDefault();
        }
    });

    document.addEventListener('keyup', function (event)
    {
        keyMap.set(event.key, false);
    });
}


function handleCameraControl(camera, keyMap)
{
    for (let [key, value] of keyMap)
    {
        if (value)
        {
            switch (key)
            {
                case "S":
                case "s":
                    camera.translateZ(2);
                    break;
                case "W":
                case "w":
                    camera.translateZ(-2);
                    break;
                case "ArrowLeft":
                case "A":
                case "a":
                    camera.rotateY(degToRad(2));
                    break;
                case "ArrowRight":
                case "D":
                case "d":
                    camera.rotateY(degToRad(-2));
                    break;
                case "Q":
                case "q":
                    camera.rotateZ(degToRad(2));
                    break;
                case "E":
                case "e":
                    camera.rotateZ(degToRad(-2));
                    break;
                case "ArrowDown":
                    camera.rotateX(degToRad(-2));
                    break;
                case "ArrowUp":
                    camera.rotateX(degToRad(2));
                    break;
            }
        }
    }
}

function degToRad(number)
{
    return number * Math.PI / 180;
}

export { init };