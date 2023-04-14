import React, {useEffect} from 'react'
import {useZustand} from '../store/useZustand'
import {customDebug} from '../utils/custom.debug'
import {getAggregate} from '../utils/plausible'
import {useControls} from 'leva'
import classNames from 'classnames'
// import {deepClone} from '../utils/common'
// import {BILLBOARD_DES_POS} from '../utils/constants'


export const Dashboard = () => {
  const {
    selMenuIndex,
    menuArr,
    dashboardData,
    setDashboardData,
    setPlausibleStep,
    selUserIndex,
    setUserDesPos,
  } = useZustand()

  const {showDashboard} = useControls({
    showDashboard: {value: true, label: 'Show Dashboard'},
  })

  useEffect(() => {
    (async () => {
      if (isLoading) {
        return
      }
      isLoading = true

      if (selMenuIndex !== null) {
        const domain = menuArr[selMenuIndex]?.domain
        customDebug().log('Dashboard#useEffect: domain: ', domain)

        if (domain) {
          const aggregate = await getAggregate(domain)
          customDebug().log('Dashboard#useEffect: aggregate: ', aggregate)
          setDashboardData(aggregate)
          const valueArr = Object.keys(aggregate).map((key) => aggregate[key].value)
          customDebug().log('Dashboard#useEffect: valueArr: ', valueArr)
          const valuesSum = valueArr.reduce((a, b) => a + b, 0)
          customDebug().log('Dashboard#useEffect: valuesSum: ', valuesSum)
          if (!valuesSum) {
            setPlausibleStep(2)
          }
          // const userDesPos = deepClone(BILLBOARD_DES_POS)
          // userDesPos[2] -= 0.5
          // setUserDesPos(selUserIndex, userDesPos)
        }
      }

      isLoading = false
    })()
  }, [menuArr, selMenuIndex, selUserIndex, setDashboardData, setPlausibleStep, setUserDesPos])

  return (
    <div className={classNames({
      'absolute z-10 p-2 bg-white border-2 border-gray-500 rounded top-3 left-2': true,
      'hidden': !showDashboard,
    })}
    >
      <div>Bounce Rate: {dashboardData?.bounce_rate?.value}</div>
      <div>Page Views: {dashboardData?.pageviews?.value}</div>
      <div>Visit Duration: {dashboardData?.visit_duration?.value}</div>
      <div>Visitors: {dashboardData?.visitors?.value}</div>
      <div className=''/>
    </div>
  )
}


let isLoading = false
