import type { ReactElement } from 'react'
import { PanelTop } from 'lucide-react'
import { AnimatedWorkLogo } from './AnimatedWorkLogo'
import type { ModelBrand } from '../../lib/model-brand'

export function WhaleHeroStage({ brand = 'deepseek' }: { brand?: ModelBrand }): ReactElement {
  return (
    <div className={`ds-runtime-wake-stage ds-runtime-wake-brand-${brand}`} aria-hidden="true">
      <div className="ds-runtime-wake-shell">
        <div className="ds-runtime-wake-titlebar">
          <span className="ds-runtime-wake-dot is-red" />
          <span className="ds-runtime-wake-dot is-yellow" />
          <span className="ds-runtime-wake-dot is-green" />
          <PanelTop className="ml-auto h-3.5 w-3.5 text-ds-faint" strokeWidth={1.7} />
        </div>
        <div className="ds-runtime-wake-body">
          <div className="ds-runtime-wake-nav">
            <span className="is-active" />
            <span />
            <span />
            <span />
          </div>
          <div className="ds-runtime-wake-canvas">
            <span className="ds-runtime-wake-thread is-one" />
            <span className="ds-runtime-wake-thread is-two" />
            <span className="ds-runtime-wake-thread is-three" />
          </div>
        </div>
        <span className="ds-runtime-wake-flow is-left" />
        <span className="ds-runtime-wake-flow is-right" />
        <div className="ds-runtime-wake-composer">
          <span />
          <span />
        </div>
        <div className="ds-runtime-wake-core">
          <span className="ds-runtime-wake-ring" />
          <AnimatedWorkLogo active brand={brand} phase="lead" size="md" className="ds-runtime-wake-logo" />
        </div>
      </div>
    </div>
  )
}
