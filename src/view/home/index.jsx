import React, { useRef, useEffect, useState } from 'react';
import { ipcRenderer } from "electron";
import _ from 'loadsh';

import './index.scss';
import { getLocalJSON, readDir, readTxt, existsSync } from '../../utils/util';
import Character from './components/character';
import Ancient from './components/ancient';
import Card from './components/card';
import Commit from './components/commit';

const Home = ({ history }) => {
  const [activeQueue, setActiveQueue] = useState([]);
  const [startPosition, setStartPosition] = useState([]);
  const [mode, setMode] = useState('slideInRight');
  const [characters, setCharacters] = useState({});
  const [cardFiles, setCardFiles] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [characterData, setCharacterData] = useState({0: [], 1: [], 2: []});
  const [ancients, setAncients] = useState([]);
  const myHoPixi = useRef();

  useEffect(() => {
    let config = getLocalJSON('config.json');
    let cards = config.cards || {};
    let characters = config.characters || {};
    setCharacters(characters);

    let files = readDir('source/person_back');
    setCardFiles(files);

    _.each(files, (file, index) => {
      let d = {};
      let subFiles = readDir(`source/person_back/${file}`);
      let name = file.split('.')[1];
      let info = readTxt(`source/person_back/${file}/介绍.txt`);
      let exists = existsSync(`source/videos/${name}.mp4`);
      d.index = index;
      _.each(cards, (card, type) => {
        if (_.includes(card, name)) {
          d.type = type;
        }
      });
      if (_.includes(subFiles, '人物.png')) {
        d.img = `./static/source/person_back/${file}/人物.png`;
      }
      d.video = exists ? `./static/source/videos/${name}.mp4` : '';
      d.name = info.split('$')[0];
      d.subTitle = info.split('$')[1];
      d.intro = info.split('$')[2];
      cardData.push(d);
    });
    setCardData(cardData);

    _.each(characters, (character, index) => {
      _.each(character.avatars || [], (avatar) => {
        let videoPath = `source/videos/${avatar.split('.')[0]}.mp4`;
        let exists = existsSync(videoPath);
        characterData[index].push({
          avatar: `./static/source/人物/${character.folder}/${avatar}`,
          video: exists ? `./static/${videoPath}` : ''
        });
      });
    });
    setCharacterData(characterData);

    _.each(config.ancients || [], (ancient, index) => {
      let avatarPath = `source/person_right/${ancient}/头像.png`;
      let exists = existsSync(avatarPath);
      let info = readTxt(`source/person_right/${ancient}/介绍.txt`);
      let infos = info.split('$');
      ancients.push({
        id: ancient,
        avatar: exists ? `./static/${avatarPath}` : '',
        name: infos[0],
        subTitle: infos[1],
        intro: infos[2],
        comment: infos[3],
        sign: infos[4]
      });
    });
    setAncients(ancients);
  }, [])

  useEffect(() => {
    if (HoPixi) {
      myHoPixi.current = new HoPixi();
    }

    // setTimeout(() => {
    //   setMode('slideInBack');
    //   HoEvents.getInstance().dispatch("hoSpriteChangeMode", { type: 1, mode: 'slideInBack' });
    // }, 50000)

    ipcRenderer.removeAllListeners("changeMode");
    ipcRenderer.on("changeMode", (event, type) => {
      if (type == 0) {
        setMode('slideInRight');
        HoEvents.getInstance().dispatch("hoSpriteChangeMode", { type: 0, mode: 'slideInRight' });
      } else if (type == 1) {
        setMode('slideInBack');
        HoEvents.getInstance().dispatch("hoSpriteChangeMode", { type: 1, mode: 'slideInBack' });
      }
    });

    const fn = () => {
      // setMode('slideInBack');
      // HoEvents.getInstance().dispatch("hoSpriteChangeMode", { type: 1, mode: 'slideInBack' });
      HoEvents.getInstance().dispatch("hoSpriteChangeMode", { type: 0, mode: 'slideInRight' });
    }
    document.addEventListener("hoSpriteLoaded", fn);
    return () => {
      document.removeEventListener("hoSpriteLoaded", fn);
      myHoPixi.current.clean()
    }
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.detail.length) {
        for (let i = 0; i < e.detail.length; i++) {
          let d = e.detail[i];
          const folder = d.id;
          if (!d.uuid) {
            d.uuid = new Date().getTime() + parseInt(Math.random() * 100000);
          }
          if (mode === 'slideInRight') {
            let hasAncient = _.find(ancients, o => o.id === folder);
            if (hasAncient) {
              d.type = 'ancient';
              d.avatar = hasAncient.avatar;
              d.name = hasAncient.name;
              d.subTitle = hasAncient.subTitle;
              d.intro = hasAncient.intro;
              d.comment = hasAncient.comment;
              d.sign = hasAncient.sign;
            } else {
              d.type = 'modern';
              _.each(characters, (character, key) => {
                let menuIndex = _.findIndex(character.matchs, o => folder === o);
                if (menuIndex !== -1) {
                  d.curIndex = Number(key);
                  d.menuIndex = menuIndex;
                }
              });
            }
          }
          if (mode === 'slideInBack') {
            let index = _.findIndex(cardFiles, o => o === d.id);
            if (index !== -1) {
              d.curIndex = index;
            }
          }
        }
        console.log(e.detail)
        setActiveQueue([...e.detail]);
      } else {
        setActiveQueue([]);
      }
    }
    document.addEventListener("hoSpriteActive", fn);
    return () => {
      document.removeEventListener("hoSpriteActive", fn);
    }
  }, [characters, mode, cardFiles]);

  const onDragStart = (evt, index, ismouse = false) => {
    let position = [...startPosition];
    if (ismouse) {
      position[index] = { x: evt.pageX, y: evt.pageY, rx: activeQueue[index].x, ry: activeQueue[index].y };
    } else {
      position[index] = { x: evt.touches[0].clientX, y: evt.touches[0].clientY, rx: activeQueue[index].x, ry: activeQueue[index].y };
    }
    setStartPosition(position);
  }

  const onDragMove = (evt, index, ismouse) => {
    let queue = [...activeQueue];
    const prevPosition = startPosition[index];
    if (prevPosition) {
      if (ismouse) {
        queue[index].x = prevPosition.rx + evt.pageX - prevPosition.x;
        queue[index].y = prevPosition.ry + evt.pageY - prevPosition.y;
      } else {
        queue[index].x = prevPosition.rx + evt.touches[0].clientX - prevPosition.x;
        queue[index].y = prevPosition.ry + evt.touches[0].clientY - prevPosition.y;
      }
      setActiveQueue(queue);
    }
  }

  const onDragEnd = (evt, index) => {
    let position = [...startPosition];
    position[index] = undefined;
    setStartPosition(position);
  }

  const onHoSpriteActiveRemoved = (index) => {
    if (window.HoEvents) {
      let queue = [...activeQueue];
      HoEvents.getInstance().dispatch("hoSpriteActiveRemoved", { index: index });
      queue.splice(index, 1);
      setActiveQueue(queue);
    }
  }

  return (
    <div className="ho-magicScreen-container">
      <video className="bg" src="./static/source/背景.mp4" autoPlay loop />
      {
        mode === 'slideInBack' && (<video className="title animate__animated animate__fadeIn animate__delay-1s" src="./static/source/标题.webm" autoPlay loop/>)
      }
      {/* <img className="bg" src="./static/source/背景.png" alt="背景" /> */}
      <div id="ho-magicScreen-stage">
        {
          activeQueue.map((sprite, index) => (
            <div className="ho-magicScreen-stage__sprite-wrapper"
              onMouseDown={e => onDragStart(e, index, true)}
              onMouseMove={e => onDragMove(e, index, true)}
              onMouseUp={e => onDragEnd(e, index, true)}
              onMouseLeave={e => onDragEnd(e, index, true)}
              onTouchStart={e => onDragStart(e, index)}
              onTouchMove={e => onDragMove(e, index)}
              onTouchEnd={e => onDragEnd(e, index)}
              onTouchCancel={e => onDragEnd(e, index)}
              style={{ left: `${sprite.x}px`, top: `${sprite.y}px`, width: `${sprite.w}px`, height: `${sprite.h}px` }}
              key={sprite.uuid} >
              {
                mode === 'slideInRight' && sprite.type === 'modern' && (<Character curIndex={sprite.curIndex} menuIndex={sprite.menuIndex} uuid={sprite.uuid} data={characterData} onClose={() => {
                  onHoSpriteActiveRemoved(index);
                }} />)
              }
              {
                mode === 'slideInRight' && sprite.type === 'ancient' && (<Ancient data={sprite} onClose={() => {
                  onHoSpriteActiveRemoved(index);
                }} />)
              }
              {
                mode === 'slideInBack' && (<Card id={sprite.id} curIndex={sprite.curIndex} uuid={sprite.uuid} files={cardFiles} data={cardData} onClose={() => {
                  onHoSpriteActiveRemoved(index);
                }} />)
              }
            </div>
          ))
        }
      </div>
      {/* {
        mode === 'slideInBack' && (<img className="title animate__animated animate__fadeIn animate__delay-1s" src="./static/source/标题.png" />)
      } */}
      <Commit />
    </div>
  )
}

export default Home;