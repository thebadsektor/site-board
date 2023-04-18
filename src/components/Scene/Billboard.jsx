/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, {useEffect} from 'react'
import {useFBX} from '@react-three/drei'
import {RigidBody} from '@react-three/rapier'
import {BILLBOARD_SCALE, BILLBOARD_URL, GROUND_SIZE} from '../../utils/constants'
import {useGesture} from '@use-gesture/react'
import {useZustand} from '../../store/useZustand'
import {getDimensions} from '../../utils/common'
import {customDebug} from '../../utils/custom.debug'


export const Billboard = () => {
  const model = useFBX(BILLBOARD_URL)
  const {
    billboardInitPos,
    setBillboardDimensions,
  } = useZustand()

  useEffect(() => {
    const billboardDimensions = getDimensions(model)
    customDebug().log('Billboard#useEffect: billboardDimensions: ', billboardDimensions)
    setBillboardDimensions(billboardDimensions)
  }, [model, setBillboardDimensions])

  const bind = useGesture({
    onPointerDown: (state) => {
      const {event} = state

      if (event.button === 0) { // Left
        const {point} = event
        customDebug().log('Billboard#useGesture: point: ', point)
      }
    },
  })

  return (
    <RigidBody
      position={billboardInitPos}
      rotation={[0, Math.PI, 0]}
      enabledRotations={[false, true, false]}
      {...bind()}
    >
      <primitive
        object={model}
        scale={BILLBOARD_SCALE}
      >
        {/* <axesHelper args={[GROUND_SIZE / BILLBOARD_SCALE]}/> */}
      </primitive>
    </RigidBody>
  )
}
