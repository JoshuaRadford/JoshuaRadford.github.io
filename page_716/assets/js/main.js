import * as utils from './utils.js';

import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './delaunay.js';
import * as perlin from './perlin.js';

class SceneManager
{
    constructor(containerId, width = 1000, height = 600)
    {
        this.container = document.getElementById(containerId);
        this.width = width;
        this.height = height;
        this.container.style.width = `${this.width}px`;
        this.container.style.height = `${this.height}px`;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100_000
        );
        this.initCameraOrigin = new THREE.Vector3(0, 150, 0);
        this.initCameraTarget = new THREE.Vector3(0, 0, 0);
        this.planeGeometry = new THREE.PlaneGeometry(-100_000, -100_000);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer = new THREE.WebGLRenderer();
        this.keyMap = new Map();
        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        });
        this.standardMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: false,
            side: THREE.DoubleSide,
            flatShading: true
        });
        this.pointsMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 2
        });
        this.planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide
        });
        this.terrainMaterial = null;
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.meshes = [];
        this.terrainMesh = null
        this.pointObjects = null;
        this.points = [];
        this.editMode = false;
        this.perlinScale = 25;
        this.xRange = 100;
        this.zRange = 100;
        this.initPointCount = 1_000;
        this.showTexture = false;
        this.showPoints = true;

        this.startButton = document.getElementById("start-button");
        this.editModeButton = document.getElementById("edit-mode-button");
        this.xRangeSlider = document.getElementById("x-range-slider");
        this.xRangeSliderOutput = document.getElementById("x-range-slider-output");
        this.zRangeSlider = document.getElementById("z-range-slider");
        this.zRangeSliderOutput = document.getElementById("z-range-slider-output");
        this.initPointCountSlider = document.getElementById("point-count-slider");
        this.initPointCountSliderOutput = document.getElementById("point-count-slider-output");
        this.toggleWireframeCheckbox = document.getElementById("toggle-wireframe");
        this.toggleShowPointsCheckbox = document.getElementById("toggle-show-points");
        this.perlinSlider = document.getElementById("perlin-slider");
        this.perlinSliderOutput = document.getElementById("perlin-slider-output");
        this.setupInputListener();

        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.rotation.x = -Math.PI / 2;
        this.scene.add(this.plane);

        this.renderer.setClearColor(0x333333);
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        this.initLighting();
        this.setCameraOrientation();
    }

    createStartingTerrain()
    {
        perlin.perlin.seed();
        let points = this.generateRandomPoints();
        this.setPoints(...points);
        this.setTerrain();
        this.animate();
    }

    setCameraOrientation(
        origin = this.initCameraOrigin,
        target = this.initCameraTarget)
    {
        this.camera.position.set(...origin);
        this.camera.lookAt(target);
        this.controls.target.copy(target);
        this.controls.update();
    }

    initLighting()
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        const ambientLight = new THREE.AmbientLight(0x404040);
        light.position.set(10, 10, 10).normalize();
        this.scene.add(light);
        this.scene.add(ambientLight);
    }

    setPoints(...points)
    {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const pointObjects = new THREE.Points(geometry, this.pointsMaterial);

        this.scene.remove(this.pointObjects);
        this.pointObjects = pointObjects;
        this.points = points;

        if (this.showPoints)
        {
            this.scene.add(this.pointObjects);
        }
    }

    addPoint(p)
    {
        this.points.push(p);
        this.setPoints(...this.points);
    }

    applyPerlinToPoints()
    {
        let newPoints = this.points;
        for (let i = 0; i < newPoints.length; i++)
        {
            newPoints[i] = this.pointToPerlin(newPoints[i]);
        }
        this.points = newPoints;
    }

    addMesh(material, triangles)
    {
        let { v: vertices, i: indices } = this.generateVerticesAndIndices(triangles);

        const vAttr = new THREE.BufferAttribute(vertices, 3);
        const iAttr = new THREE.BufferAttribute(indices, 1);

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', vAttr);
        geometry.setIndex(iAttr);
        geometry.attributes.position.needsUpdate = true;
        geometry.index.needsUpdate = true;
        geometry.computeVertexNormals();
        let mesh = new THREE.Mesh(geometry, material);

        this.meshes.push(mesh);
        this.scene.add(mesh);

        return mesh;
    }

    clearMeshes()
    {
        this.meshes.forEach(m => this.scene.remove(m));
    }

    setTerrain()
    {
        const i = this.meshes.indexOf(this.terrainMesh);
        if (i > -1) this.meshes.splice(i, 1);
        this.scene.remove(this.terrainMesh);

        let triangles = this.generateTriangulation(this.points);
        const mesh = this.addMesh(this.terrainMaterial, triangles);
        this.terrainMesh = mesh;
    }

    generateTriangulation(points)
    {
        let formattedPoints = points.map(p => [p.x, p.z]);
        let dela = new Delaunay(formattedPoints);
        let triangles = dela.triangulate();
        console.log(triangles);
        return triangles;
    }

    generateVerticesAndIndices(triangles = [])
    {
        let vertices = [];
        let indices = [];
        for (let i = 0; i < triangles.length; i++)
        {
            let point = new THREE.Vector3(triangles[i][0], 0, triangles[i][1]);
            point = this.pointToPerlin(point);
            vertices.push(...point);
            indices.push(i);  // Create a sequential index for each vertex
        }
        vertices = new Float32Array(vertices);
        indices = new Uint16Array(indices);

        return { v: vertices, i: indices };
    }

    generateRandomPoints(n = this.initPointCount, xRange = this.xRange, zRange = this.zRange)
    {
        n = Math.abs(n);
        xRange = Math.abs(xRange);
        zRange = Math.abs(zRange);
        let points = [];
        for (let i = 0; i < n; i++)
        {
            let p = new THREE.Vector3(
                utils.getRandomValue(-xRange, xRange),
                0,
                utils.getRandomValue(-zRange, zRange)
            );
            p = this.pointToPerlin(p);
            points.push(p);
        }

        return points;
    }

    pointToPerlin(point)
    {
        let x = point.x;
        let z = point.z;
        let y = perlin.perlin.get(
            x / 100 * this.perlinScale / 10,
            z / 100 * this.perlinScale / 10
        ) * this.perlinScale;
        return new THREE.Vector3(x, y, z);
    }

    getPointRange()
    {
        let xMin, xMax, yMin, yMax;
        this.points.forEach(p =>
        {
            xMin = (!xMin || (xMin && p.x < xMin)) ? p.x : xMin;
            xMax = (!xMax || (xMax && p.x > xMax)) ? p.x : xMax;
            yMin = (!yMin || (yMin && p.y < yMin)) ? p.y : yMin;
            yMax = (!yMax || (yMax && p.y > yMax)) ? p.y : yMax;
        });
        return { x: (xMax - xMin), y: (yMax - yMin) };
    }

    setupInputListener()
    {
        this.container.addEventListener('dblclick', (event) =>
        {
            if (!this.editMode)
            {
                this.setCameraOrientation();
            }
        });

        this.container.addEventListener("click", (event) =>
        {
            if (this.editMode)
            {
                const rect = this.renderer.domElement.getBoundingClientRect();
                this.mouse.x =
                    ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y =
                    -((event.clientY - rect.top) / rect.height) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);

                const intersects = this.raycaster.intersectObject(this.plane);
                if (intersects.length > 0)
                {
                    let point = intersects[0].point;
                    point = new THREE.Vector3(point.x, 0, point.z);
                    point = this.pointToPerlin(point);
                    this.addPoint(point);
                    this.setTerrain();
                }
            }
        });

        this.startButton.addEventListener("click", (event) =>
        {
            this.createStartingTerrain();
        });

        this.editModeButton.addEventListener("click", (event) =>
        {
            this.editMode = !this.editMode;
            this.controls.enabled = !this.controls.enabled;

            let style = getComputedStyle(document.body);
            let c2 = style.getPropertyValue('--color-secondary');
            let hc = style.getPropertyValue('--header-color');
            this.editModeButton.style.backgroundColor = this.editMode ? c2 : hc;
            this.container.style.borderColor = this.editMode ? c2 : hc;
        });

        this.perlinSliderOutput.innerHTML = this.perlinSlider.value;
        this.perlinSlider.addEventListener("input", (event) =>
        {
            this.perlinSliderOutput.innerHTML = event.target.value;
            this.perlinScale = event.target.value;
            this.applyPerlinToPoints();
            this.setPoints(...this.points);
            this.setTerrain();
        });

        this.xRangeSliderOutput.innerHTML = this.xRangeSlider.value;
        this.xRangeSlider.addEventListener("input", (event) =>
        {
            this.xRangeSliderOutput.innerHTML = event.target.value;
            this.xRange = event.target.value;
        });

        this.zRangeSliderOutput.innerHTML = this.zRangeSlider.value;
        this.zRangeSlider.addEventListener("input", (event) =>
        {
            this.zRangeSliderOutput.innerHTML = event.target.value;
            this.zRange = event.target.value;
        });

        this.initPointCountSliderOutput.value = this.initPointCountSlider.value;
        this.initPointCountSlider.addEventListener("input", (event) =>
        {
            this.initPointCountSliderOutput.value = event.target.value;
            this.initPointCount = event.target.value;
        });

        this.initPointCountSliderOutput.addEventListener("input", (event) =>
        {
            this.initPointCountSlider.value = event.target.value;
            this.initPointCount = event.target.value;
        });

        this.toggleWireframeCheckbox.checked = this.showTexture;
        this.terrainMaterial = (this.showTexture) ? this.standardMaterial : this.wireframeMaterial;
        this.toggleWireframeCheckbox.addEventListener("change", (event) =>
        {
            this.showTexture = this.toggleWireframeCheckbox.checked;
            this.terrainMaterial = (this.showTexture) ? this.standardMaterial : this.wireframeMaterial;
            this.setTerrain();
        });

        this.toggleShowPointsCheckbox.checked = this.showPoints;
        this.toggleShowPointsCheckbox.addEventListener("change", (event) =>
        {
            this.showPoints = this.toggleShowPointsCheckbox.checked;
            this.setPoints(...this.points);
        });
    }

    animate()
    {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

function init()
{
    const containerId = 'scene-container';
    let container = document.getElementById(containerId);
    const sceneManager = new SceneManager(containerId);
}

export { init, SceneManager };