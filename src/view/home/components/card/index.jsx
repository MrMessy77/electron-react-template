import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import _ from 'loadsh';

import './index.scss';
import { readDir, readTxt, getLocalJSON, existsSync } from '../../../../utils/util';

const Card = (props) => {
  const id = props.id;
  const uuid = props.uuid;
  const [curIndex, setCurIndex] = useState(props.curIndex || 0);
  const [mediaStatus, setMediaStatus] = useState('pause');
  const [data, setData] = useState(props.data || []);

  useEffect(() => {
    let config = getLocalJSON('config.json');

    // if (id) {
    //   let index = _.findIndex(files, o => o === id);
    //   if (index !== -1) {
    //     setCurIndex(index);
    //   }
    // }

    drawQRCode(config.qrcode_url);
  }, []);

  const drawQRCode = (url) => {
    QRCode.toCanvas(window[`qrcode_${uuid}`],
      url,
      {
        margin: 0
      },
      (error) => {
        if (error) console.error(error);
      });
  }

  const prev = () => {
    setMediaStatus('pause');
    if (curIndex === 0) {
      return
    }
    setCurIndex(curIndex - 1);
  }

  const next = () => {
    setMediaStatus('pause');
    if (curIndex === data.length - 1) {
      return
    }
    setCurIndex(curIndex + 1);
  }

  return (
    <div className='card animate__animated animate__fadeIn'>
      <div className='card__content'>
        {/* <img className='card__content--left' src="./static/source/左.png" onClick={prev} /> */}
        {
          data[curIndex] && (
            <div className='card__content--item'>
              {
                data[curIndex].type === 'video' && (
                  <img className='card__content--item-bg' src='./static/source/底图1.png' />
                )
              }
              {
                data[curIndex].type === 'image' && (
                  <img className='card__content--item-bg' src='./static/source/底图2.png' />
                )
              }
              <div className='card__content--item-info'>
                {
                  data[curIndex].img ? (
                    <div className='card__content--item-info-header'>
                      <img className='card__content--item-info-header-img' src={data[curIndex].img} />
                      {
                        data[curIndex].type === 'video' && mediaStatus === 'pause' && (
                          <div className='card__content--item-info-header-media'>
                            <img className='card__content--item-info-header-media-play' src='./static/source/播放.png' onClick={() => {
                              if (data[curIndex].video) {
                                setMediaStatus('play');
                              }
                            }} />
                          </div>
                        )
                      }
                      {
                        data[curIndex].video && mediaStatus === 'play' && (
                          <video className='card__content--item-info-header-video' src={data[curIndex].video} autoPlay onEnded={() => {
                            setMediaStatus('pause');
                          }} />
                        )
                      }
                      {
                        data[curIndex].video && mediaStatus === 'play' && (
                          <img className="card__content--item-info-header-back animate__animated animate__fadeIn" src="./static/source/返回.png" onClick={() => {
                            setMediaStatus('pause');
                          }}/>
                        )
                      }
                    </div>
                  ) : (
                    <div className='card__content--item-info-noheader'></div>
                  )
                }
                <div className='card__content--item-info-body'>
                  <div className='card__content--item-info-body-row'>
                    <div className='card__content--item-info-body-name'>{data[curIndex].name}</div>
                    <div className='card__content--item-info-body-subtitle'>{data[curIndex].subTitle}</div>
                  </div>
                  <div className='card__content--item-info-body-intro'>{data[curIndex].intro}</div>
                </div>


              </div>
              {/* 关闭按钮 */}
              <img className={data[curIndex].type === 'video' ? "card__content--item-close" : "card__content--item-close2"} src="./static/source/关闭.png" onClick={props.onClose} />
            </div>
          )
        }
        {/* <img className='card__content--right' src="./static/source/右.png" onClick={next} /> */}

        {/* 二维码位置信息 */}
        <div className="card__content--qrcode">
          <div className="wrap">
            <canvas id={`qrcode_${uuid}`}></canvas>
          </div>
          <span className="tips">扫码留言</span>
        </div>
      </div>
    </div>
  )
}

export default Card;