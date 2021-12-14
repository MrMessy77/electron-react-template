import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import _ from 'loadsh';

import './index.scss';
import { getLocalJSON, existsSync } from '../../../../utils/util';

const Character = (props) => {
  const uuid = props.uuid;
  const [autoPlay, setAutoPlay] = useState(props.curIndex !== undefined ? true : false);
  const [curIndex, setCurIndex] = useState(props.curIndex !== undefined ? props.curIndex : 1);
  const [menuIndex, setMenuIndex] = useState(props.menuIndex);
  const [data, setData] = useState(props.data || {});
  const [selData, setSelData] = useState({});

  useEffect(() => {
    let config = getLocalJSON('config.json');
    // let characters = config.characters || {};
    // _.each(characters, (character, index) => {
    //   _.each(character.avatars || [], (avatar) => {
    //     let videoPath = `source/videos/${avatar.split('.')[0]}.mp4`;
    //     let exists = existsSync(videoPath);
    //     data[index].push({
    //       avatar: `./static/source/人物/${character.folder}/${avatar}`,
    //       video: exists ? `./static/${videoPath}` : ''
    //     });
    //   });
    // });
    // setData(data);

    drawQRCode(config.qrcode_url);
  }, []); 

  useEffect(() => {
    changeSelData();
  }, [menuIndex]);

  const changeSelData = () => {
    if (menuIndex !== undefined) {
      setSelData(data[curIndex][menuIndex]);
    }
  }

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

  return (
    <div className='character animate__animated animate__fadeIn'>
      <div className='character__tabs'>
        <div className='character__tabs--item' onClick={() => {
          setCurIndex(0);
        }}>
          {
            curIndex === 0 ? (
              <>
                <img className='character__tabs--item-img' src="./static/source/人物/盛氏后人（选中）.png" />
                <img className='character__tabs--item-arrow' src="./static/source/人物/箭头.png" />
              </>
            ) : (
              <img className='character__tabs--item-img' src="./static/source/人物/盛氏后人（未选中）.png" />
            )
          }
        </div>
        <div className='character__tabs--item' onClick={() => {
          setCurIndex(1);
        }}>
          {
            curIndex === 1 ? (
              <>
                <img className='character__tabs--item-img' src="./static/source/人物/盛宣怀研究会（选中）.png" />
                <img className='character__tabs--item-arrow' src="./static/source/人物/箭头.png" />
              </>
            ) : (
              <img className='character__tabs--item-img' src="./static/source/人物/盛宣怀研究会（未选中）.png" />
            )
          }
        </div>
        <div className='character__tabs--item' onClick={() => {
          setCurIndex(2);
        }}>
          {
            curIndex === 2 ? (
              <>
                <img className='character__tabs--item-img' src="./static/source/人物/专家学者（选中）.png" />
                <img className='character__tabs--item-arrow' src="./static/source/人物/箭头.png" />
              </>
            ) : (
              <img className='character__tabs--item-img' src="./static/source/人物/专家学者（未选中）.png" />
            )
          }
        </div>
      </div>
      <div className='character__intro'>
        <img className='character__intro--bg' src="./static/source/人物/展开.png"/>
        <div className='character__intro--mask'></div>
        <div className='character__intro--content'>
          {
            (data[curIndex] || []).map((item, index) => {
              return (
                <img className='character__intro--content-item' src={item.avatar} key={index} onClick={() => {
                  setMenuIndex(index);
                  setAutoPlay(true);
                }}/>
              )
            })
          }
        </div>
        {/* 二维码位置信息 */}
        <div className="character__intro--qrcode">
          <div className="wrap">
            <canvas id={`qrcode_${uuid}`}></canvas>
          </div>
          <span className="tips">扫码留言</span>
        </div>
        {/* 人物视频 */}
        {
          autoPlay && selData.video && <video className='character__intro--video' src={selData.video} autoPlay onEnded={() => {
            setAutoPlay(false);
          }}/>
        }
        {/* 关闭按钮 */}
        <img className="character__intro--close" src="./static/source/关闭.png" onClick={props.onClose}/>
        {/* 返回按钮 */}
        {
          autoPlay && selData.video && (
            <img className="character__intro--back animate__animated animate__fadeIn" src="./static/source/返回.png" onClick={() => {
              setAutoPlay(false);
            }}/>
          )
        }
      </div>
    </div>
  )
}

export default Character;