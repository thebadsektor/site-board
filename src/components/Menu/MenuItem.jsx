import React from 'react'
import classNames from 'classnames'
// eslint-disable-next-line no-unused-vars
import {useZustand} from '../../store/useZustand'


export const MenuItem = () => {
  return (
    <div className={classNames({
      'flex items-center p-2 text-white border-2 border-b-0 border-white rounded-tl rounded-tr cursor-pointer': true,
    })}
    >
      Menu
      <div className=''/>
    </div>
  )
}
