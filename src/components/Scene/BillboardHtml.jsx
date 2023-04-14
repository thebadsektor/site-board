import React from 'react'
import {Html} from '@react-three/drei'
import {BILLBOARD_HTML_SIZE} from '../../utils/constants'
import {useZustand} from '../../store/useZustand'
import classNames from 'classnames'
import {BillboardPage} from './BillboardPage'


export const BillboardHtml = ({hide}) => {
  const {
    billboardDesPos,
    billboardDimensions,
  } = useZustand()

  const halfHeight = billboardDimensions.height * 0.545
  const htmlPos = [billboardDesPos[0], billboardDesPos[1] + halfHeight, billboardDesPos[2] - 0.2]

  return (
    <Html
      transform
      position={htmlPos}
      rotation={[0, Math.PI, 0]}
      zIndexRange={[0, 0]}
    >
      <div
        className={classNames({
          'relative flex items-center justify-center text-white bg-black rounded': true,
          'hidden': !!hide,
        })}
        style={{
          width: BILLBOARD_HTML_SIZE,
          height: BILLBOARD_HTML_SIZE,
        }}
      >
        <BillboardPage/>
      </div>
    </Html>
  )
}
