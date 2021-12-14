import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from "electron";
import _ from 'loadsh';

import './index.scss';
import { commentList, giveCommit } from "../../../../api";

const Commit = () => {
  const [showList, setShowList] = useState(false);
  const [commits, setCommits] = useState([]);
  const scrollRef = useRef();
  const timer = useRef();

  useEffect(() => {
    getComment();
  }, []);

  useEffect(() => {
    ipcRenderer.removeAllListeners("comment");
    ipcRenderer.on("comment", (event, data) => {
      let el = document.getElementById("comment");
      if (el) {
        el.scrollTop = 0;
      }

      if (scrollRef.current) {
        clearTimeout(scrollRef.current);
        scrollRef.current = null;
      }

      // console.log(data);
      commits.unshift(data);
      setCommits(commits);

      setTimeout(() => {
        scrollEl();
      }, 2 * 1000);
    });
  }, [commits]);

  // 获取评论列表
  const getComment = async () => {
    let result = await commentList(1);
    setCommits(result);
  }

  // 点赞
  const give = async (id, index) => {
    let likes_num = await giveCommit(id);

    let commits_clone = _.cloneDeep(commits);
    commits_clone[index].likes = likes_num;
    commits_clone[index].liked = true;
    setCommits(commits_clone);

    refreshTimer();
  }

  // 评论区自动轮播
  const scrollEl = () => {
    scrollRef.current = setInterval(() => {
      let el = document.getElementById("comment");
      if (el) {
        if (
          el.scrollTop >=
          el.scrollHeight - el.clientHeight
        ) {
          el.scrollTop = 0;
        } else {
          el.scrollTop = el.scrollTop + 1;
        }
      }
    }, 60);
  }

  const refreshTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    timer.current = setTimeout(() => {
      let commits_clone = _.cloneDeep(commits);
      _.each(commits_clone, (commit) => {
        commit.liked = false;
      });
      setCommits(commits_clone);
    }, 10 * 1000);
  }

  return (
    <div className='commit'>
      {
        showList ? (
          <img className='commit__btn animate__animated animate__fadeIn animate__delay-500ms' src="./static/source/关闭云端互动.png" onClick={() => {
            setShowList(false);
            if (scrollRef.current) {
              clearTimeout(scrollRef.current);
              scrollRef.current = null;
            }
          }} />
        ) : (
          <img className='commit__btn' src="./static/source/云端互动按钮.png" onClick={() => {
            setShowList(true);
            scrollEl();
          }} />
        )
      }
      {
        showList && (
          <div className='commit__list animate__animated animate__fadeInRight'>
            <div className='commit__list-mask'></div>
            <img className='commit__list-bg' src="./static/source/云端互动背景.png" />
            <div className='commit__list-content' id="comment">
              {
                commits.map((commit, index) => {
                  return (
                    <div className='commit__list-content-item animate__animated animate__fadeInRight' key={commit.id}>
                      <div className='commit__list-content-item-text'>{commit.content || ''}</div>
                      <div className='commit__list-content-item-give' onClick={() => {
                        give(commit.id, index);
                      }}>
                        <img className={commit.liked ? 'animate__animated animate__bounceIn' : ''} src={commit.liked ? './static/source/点赞确认.png' : './static/source/点赞.png'} />
                        <div className='likes'>{commit.likes || 0}</div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Commit;