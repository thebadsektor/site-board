import React, {useCallback, useEffect} from 'react'
import * as THREE from 'three'
import {useControls} from 'leva'
import classNames from 'classnames'
import {useZustand} from '../../store/useZustand'
import {getAggregate, getRealtimeVisitors} from '../../utils/plausible'
import {CHARACTER_BILLBOARD_VIEW_DISTANCE, CHARACTER_POS_GENERATION_HALF_WIDE, CHARACTER_URLS, REALTIME_DURATION, isDevMode} from '../../utils/constants'
import {customDebug} from '../../utils/custom.debug'
import {deepClone, getBox3RandomPoint} from '../../utils/common'


export const Dashboard = () => {
  const {
    selMenuIndex,
    menuArr,
    aggregate,
    setAggregate,
    setPlausibleStep,
    realtimeVisitors,
    setRealtimeVisitors,
    billboardDesPos,
    usersInitPos,
    setUsersInitPos,
    setUsersDesPos,
    isBackgroundLoading,
    setIsBackgroundLoading,
  } = useZustand()

  const {showDashboard} = useControls({
    showDashboard: {value: true, label: 'Show Dashboard'},
  })

  const loadDashboardData = useCallback(async () => {
    if (isBackgroundLoading) {
      return
    }
    setIsBackgroundLoading(true)
    customDebug().log('Dashboard#loadDashboardData')

    if (selMenuIndex !== null) {
      if (isDevMode) {
        const newRealtimeVisitors = parseInt(Math.random() * (CHARACTER_URLS.length - 1)) + 1
        // customDebug().log('Dashboard#loadDashboardData: newRealtimeVisitors: ', newRealtimeVisitors)
        setRealtimeVisitors(newRealtimeVisitors)
      } else {
        const domain = menuArr[selMenuIndex]?.domain

        if (domain) {
          const newAggregate = await getAggregate(domain)
          if (newAggregate) {
            setAggregate(newAggregate)
          }

          if (newAggregate) {
            const valueArr = Object.keys(newAggregate).map((key) => newAggregate[key].value)
            const valuesSum = valueArr.reduce((a, b) => a + b, 0)
            if (!valuesSum) {
              setPlausibleStep(2)
            }
          }

          const newRealtimeVisitors = await getRealtimeVisitors(domain)
          customDebug().log('Dashboard#loadDashboardData: newRealtimeVisitors: ', newRealtimeVisitors)
          if (newRealtimeVisitors !== undefined) {
            setRealtimeVisitors(newRealtimeVisitors)
          }
        }
      }
    }

    setIsBackgroundLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selMenuIndex, setRealtimeVisitors, menuArr, setAggregate, setPlausibleStep])

  useEffect(() => {
    loadDashboardData()
    if (intervalId) {
      clearInterval(intervalId)
    }
    intervalId = setInterval(loadDashboardData, REALTIME_DURATION)
  }, [loadDashboardData])

  useEffect(() => {
    const visibleCharacters = Math.min(realtimeVisitors, CHARACTER_URLS.length)

    // Set users' initial position
    const characterPosGenerationBox3 = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(billboardDesPos[0], 0, billboardDesPos[2] - CHARACTER_BILLBOARD_VIEW_DISTANCE - CHARACTER_POS_GENERATION_HALF_WIDE),
        new THREE.Vector3(CHARACTER_POS_GENERATION_HALF_WIDE, 0, CHARACTER_POS_GENERATION_HALF_WIDE),
    )
    const additionalUsersInitPos = Array.from({length: CHARACTER_URLS.length - visibleCharacters}).map(() => getBox3RandomPoint(characterPosGenerationBox3))
    customDebug().log('Scene#useEffect[realtimeVisitors]: additionalUsersInitPos: ', additionalUsersInitPos)
    const newUsersInitPos = [
      ...usersInitPos.slice(0, visibleCharacters),
      ...additionalUsersInitPos,
    ]
    customDebug().log('Scene#useEffect[realtimeVisitors]: newUsersInitPos: ', newUsersInitPos)
    setUsersInitPos(newUsersInitPos)

    // Set users' destination position
    const newUserDesPos = deepClone(billboardDesPos)
    newUserDesPos[2] -= CHARACTER_BILLBOARD_VIEW_DISTANCE
    const newUsersDesPos = Array.from({length: realtimeVisitors}).fill(newUserDesPos)
    for (let i = realtimeVisitors; i < newUsersInitPos.length; i++) {
      newUsersDesPos.push(newUsersInitPos[i])
    }
    customDebug().log('Scene#useEffect[realtimeVisitors]: newUsersDesPos: ', newUsersDesPos)
    customDebug().log('Scene#useEffect[realtimeVisitors]: billboardDesPos: ', billboardDesPos)
    setUsersDesPos(newUsersDesPos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeVisitors])

  return (
    <div className={classNames({
      'absolute z-10 p-2 bg-white border-2 border-gray-500 rounded top-3 left-2': true,
      'hidden': !showDashboard || !realtimeVisitors,
    })}
    >
      <div>Current Visitors: {realtimeVisitors}</div>
      <div>Bounce Rate: {aggregate?.bounce_rate?.value}</div>
      <div>Page Views: {aggregate?.pageviews?.value}</div>
      <div>Visit Duration: {aggregate?.visit_duration?.value}</div>
      <div>Visitors: {aggregate?.visitors?.value}</div>
    </div>
  )
}


let intervalId
