import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.9}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.2}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.7} />
    </EffectComposer>
  )
}
