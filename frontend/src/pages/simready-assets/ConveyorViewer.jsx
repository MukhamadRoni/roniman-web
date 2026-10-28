import { useEffect, useRef, useState } from 'react'
import { frameCamera } from './framing.js'

const FOV = 40

const isTouch = () => typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches

export default function ConveyorViewer({ src, poster, c, alt = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [percent, setPercent] = useState(null)
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    let disposed = false
    let started = false
    let raf = 0
    let io = null
    let ro = null
    let renderer = null
    let controls = null
    let scene = null
    let envTarget = null
    let inView = false
    let ready = false
    let dragging = false
    let settleUntil = 0
    let schedule = () => {}

    const fail = () => { if (!disposed) setStatus('error') }

    async function start() {
      if (started) return
      started = true
      setStatus('loading')
      try {
        const [THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }, { MeshoptDecoder }] =
          await Promise.all([
            import('three'),
            import('three/addons/loaders/GLTFLoader.js'),
            import('three/addons/controls/OrbitControls.js'),
            import('three/addons/environments/RoomEnvironment.js'),
            import('three/addons/libs/meshopt_decoder.module.js'),
          ])
        if (disposed) return

        try {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        } catch {
          fail()
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        scene = new THREE.Scene()
        const pmrem = new THREE.PMREMGenerator(renderer)
        const room = new RoomEnvironment()
        envTarget = pmrem.fromScene(room, 0.04)
        room.dispose()
        scene.environment = envTarget.texture
        pmrem.dispose()

        const loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)
        const gltf = await new Promise((resolve, reject) => {
          loader.load(src, resolve, (e) => {
            if (!disposed && e.lengthComputable && e.total > 0) {
              setPercent(Math.round((e.loaded / e.total) * 100))
            }
          }, reject)
        })
        if (disposed) return

        const model = gltf.scene
        model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
        scene.add(model)

        const box = new THREE.Box3().setFromObject(model)
        const sizeV = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const r = sizeV.length() / 2

        const light = new THREE.DirectionalLight(0xffffff, 1.2)
        light.position.set(center.x + r, center.y + r * 2, center.z + r)
        light.target.position.copy(center)
        light.castShadow = true
        light.shadow.mapSize.set(1024, 1024)
        light.shadow.camera.left = -r * 1.5
        light.shadow.camera.right = r * 1.5
        light.shadow.camera.top = r * 1.5
        light.shadow.camera.bottom = -r * 1.5
        light.shadow.camera.near = 0.1
        light.shadow.camera.far = r * 6
        scene.add(light, light.target)

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(r * 6, r * 6),
          new THREE.ShadowMaterial({ opacity: 0.28 }),
        )
        ground.rotation.x = -Math.PI / 2
        ground.position.set(center.x, box.min.y, center.z)
        ground.receiveShadow = true
        scene.add(ground)

        const camera = new THREE.PerspectiveCamera(FOV, 1, 0.01, 100)
        controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.target.copy(center)
        controls.maxPolarAngle = Math.PI * 0.495
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        controls.autoRotate = !reduce
        controls.autoRotateSpeed = 0.8
        controls.addEventListener('start', () => {
          controls.autoRotate = false
          dragging = true
          setInteracted(true)
          schedule()
        })
        controls.addEventListener('change', () => schedule())
        controls.addEventListener('end', () => {
          dragging = false
          settleUntil = performance.now() + 1200 // let damping settle
          schedule()
        })

        let framed = false
        const resize = () => {
          const w = wrap.clientWidth
          const h = wrap.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          const f = frameCamera([sizeV.x, sizeV.y, sizeV.z], FOV, camera.aspect)
          controls.minDistance = f.minDistance
          controls.maxDistance = f.maxDistance
          const dir = framed
            ? camera.position.clone().sub(controls.target).normalize()
            : new THREE.Vector3(1, 0.6, 1).normalize()
          const cur = camera.position.distanceTo(controls.target)
          const d = framed ? Math.min(Math.max(cur, f.minDistance), f.maxDistance) : f.distance
          camera.position.copy(controls.target).addScaledVector(dir, d)
          camera.updateProjectionMatrix()
          framed = true
          schedule()
        }
        resize()
        ro = new ResizeObserver(resize)
        ro.observe(wrap)

        let first = true
        const tick = () => {
          raf = 0
          if (disposed || !inView) return
          controls.update()
          renderer.render(scene, camera)
          if (first) { first = false; setStatus('ready') }
          // Keep looping only while something is moving; otherwise render on demand.
          if (controls.autoRotate || dragging || performance.now() < settleUntil) schedule()
        }
        schedule = () => {
          if (!raf && ready && inView && !disposed) raf = requestAnimationFrame(tick)
        }
        ready = true
        schedule()
      } catch {
        fail()
      }
    }

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        inView = entries[entries.length - 1].isIntersecting
        if (inView) {
          if (!started) start()
          else schedule()
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      }, { rootMargin: '200px' })
      io.observe(wrap)
    } else {
      inView = true
      start()
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io?.disconnect()
      ro?.disconnect()
      controls?.dispose()
      if (scene) {
        scene.traverse((o) => {
          o.geometry?.dispose?.()
          const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
          mats.forEach((m) => {
            Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose() })
            m.dispose()
          })
        })
      }
      envTarget?.dispose()
      renderer?.dispose()
      renderer?.forceContextLoss?.()
    }
  }, [src])

  return (
    <div className="sr-viewer-block">
      <div className="sr-viewer" ref={wrapRef} data-status={status}>
        <img className="sr-viewer-poster" src={poster} alt={alt} data-hidden={status === 'ready'} />
        <canvas className="sr-viewer-canvas" ref={canvasRef} role="img" aria-label={alt} data-hidden={status !== 'ready'} />
        {status === 'loading' && (
          <div className="sr-viewer-progress" role="status">
            {c.loading}{percent != null ? ` ${percent}%` : '…'}
          </div>
        )}
        {status === 'ready' && !interacted && <div className="sr-viewer-hint">{isTouch() && c.hintTouch ? c.hintTouch : c.hint}</div>}
      </div>
      {status === 'error' && <p className="sr-note sr-viewer-error" role="status">{c.viewerError}</p>}
    </div>
  )
}
