import React, {useEffect} from 'react'
import {MenuItem} from './MenuItem'
import {AddLink} from './AddLink'
import {useZustand} from '../../store/useZustand'
import {customDebug} from '../../utils/custom.debug'
import {getUserData} from '../../utils/mongo.db'
import {Profile} from './Profile'
import {useAuth0} from '@auth0/auth0-react'


export const Menu = () => {
  const {
    menuArr,
    setMenuArr,
    setSelMenuIndex,
    setIsLoading,
  } = useZustand()
  const {isAuthenticated, user} = useAuth0()

  useEffect(() => {
    (async () => {
      if (!user?.name) {
        return
      }
      setIsLoading(true)
      const getDataRes = await getUserData(user.name)
      customDebug().log('Menu#useEffect[user]: getDataRes: ', getDataRes)

      if (Array.isArray(getDataRes) && getDataRes.length) {
        setMenuArr(getDataRes)
        setSelMenuIndex(0)
      }

      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className='flex items-center justify-between w-screen h-12 bg-black border-0 border-b-2 border-white'>
      <div className='flex h-full gap-2 p-2 pb-0'>
        {menuArr.map((menu, index) =>
          <MenuItem
            key={index}
            index={index}
            menu={menu}
          />,
        )}
        {isAuthenticated && <AddLink/>}
      </div>
      <Profile/>
    </div>
  )
}
