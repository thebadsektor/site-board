import React, {useRef} from 'react'
import {useZustand} from '../../store/useZustand'
import {createSite} from '../../utils/plausible'
import {saveData} from '../../utils/mongo.db'
import {customDebug} from '../../utils/custom.debug'
import {urlToDomain} from '../../utils/common'
import {useAuth0} from '@auth0/auth0-react'


export const Create = ({domain}) => {
  const {
    nextPlausibleStep,
    setAlertMsg,
    menuArr,
    addMenu,
    setSelMenuIndex,
    onConfirm,
    setIsLoading,
  } = useZustand()
  const {user} = useAuth0()
  const inputRef = useRef(null)

  return (
    <>
      <input
        className='w-3/5 p-1 text-black rounded'
        ref={inputRef}
        type='text'
        value={domain}
      />
      <button
        className='pl-2 pr-2 border-2 rounded'
        onClick={() => onConfirm(async () => {
          setIsLoading(true)

          if (!user?.name) {
            setAlertMsg('Username not correct.')
            setIsLoading(false)
            return
          }

          const inputVal = inputRef.current.value
          const urlDomain = urlToDomain(inputVal)
          customDebug().log('Create#onClick: urlDomain: ', urlDomain)

          if (!urlDomain) {
            setAlertMsg('Input correct domain please.')
            setIsLoading(false)
            return
          }

          const createSiteRes = await createSite(urlDomain)
          customDebug().log('Create#onClick: createSiteRes: ', createSiteRes)
          const siteData = createSiteRes?.data

          if (siteData?.domain !== urlDomain) {
            setAlertMsg('This domain cannot be registered. Perhaps one of your colleagues registered it? If that\'s not the case, please contact support@plausible.io')
            setIsLoading(false)
            return
          }

          siteData.username = user.name
          const saveDataRes = await saveData(siteData)
          customDebug().log('Create#onClick: saveDataRes: ', saveDataRes)
          const insertedId = saveDataRes?.data?.insertedId

          if (saveDataRes?.status !== 200 || !insertedId) {
            setAlertMsg('Backend is disconnected. Check your internet connection.')
            setIsLoading(false)
            return
          }

          siteData._id = insertedId
          setSelMenuIndex(menuArr.length)
          addMenu(siteData)
          nextPlausibleStep()
          setIsLoading(false)
        })}
      >
        Enter site URL
      </button>
    </>
  )
}
