import React, { useState, useEffect } from 'react';
import _ from 'loadsh';

import './index.scss';
import { getLocalJSON } from '../../../../utils/util';

const Ancient = (props) => {
  const data = props.data;

  useEffect(() => {
    console.log(data)
    let config = getLocalJSON('config.json');
  }, []); 

  return (
    <div className='ancient animate__animated animate__fadeIn'>
      <img className='ancient__bg' src="./static/source/底.png"/>
      <div className='ancient__content'>
        <div className='ancient__content--left'>
          <img className='ancient__content--left-avatar' src={data.avatar}/>
          <p className='ancient__content--left-name'>{data.name || ''}</p>
          <p className='ancient__content--left-subtitle'>{data.subTitle || ''}</p>
        </div>
        <div className='ancient__content--right'>
          <div className='ancient__content--right-kuang'>
            <img className='ancient__content--right-kuang-bg' src='./static/source/框.png'/>
            <div className='ancient__content--right-kuang-content'>
              <p className='ancient__content--right-kuang-content-comment'>{data.comment || ''}</p>
              <p className='ancient__content--right-kuang-content-sign'>— {data.sign || ''}</p>
            </div>
          </div>
          <div className='ancient__content--right-intro'>
            <img className='ancient__content--right-intro-title' src='./static/source/人物介绍.png'/>
            <p className='ancient__content--right-intro-text'>{data.intro || ''}</p>
          </div>
        </div>
      {/* <img className='ancient__kuang' src="./static/source/框.png"/> */}

      </div>
      {/* 关闭按钮 */}
      <img className="ancient__close" src="./static/source/关闭.png" onClick={props.onClose}/>
    </div>
  )
}

export default Ancient;