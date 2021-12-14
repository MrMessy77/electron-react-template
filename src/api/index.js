import { axios } from '@/utils/request';

// 评论列表信息
export const commentList = (display, pageSize = 50) => {
  // return axios({
  //   method: 'GET',
  //   url: 'sxh/comment/list',
  //   params: {
  //     pageSize, display, sorter: '{"create_time":"descend"}'
  //   }
  // });

  return [
        {
            "id": 32,
            "content": "盛宣怀高度的政治智慧，先进的商业理念，值得人们学习。",
            "display": 1,
            "likes": 889,
            "create_time": "2021-11-18T09:29:02.000Z"
        },
        {
            "id": 33,
            "content": "盛宣怀的人才思想独特新颖。",
            "display": 1,
            "likes": 587,
            "create_time": "2021-11-18T09:30:10.000Z"
        },
        {
            "id": 34,
            "content": "盛宣怀的思想对于我们很有借鉴意义。",
            "display": 1,
            "likes": 1603,
            "create_time": "2021-11-18T09:30:47.000Z"
        },
        {
            "id": 35,
            "content": "盛宣怀展示了新时代苏商的文化建设。",
            "display": 1,
            "likes": 536,
            "create_time": "2021-11-18T09:32:08.000Z"
        },
        {
            "id": 36,
            "content": "盛宣怀对社会的奉献极大。",
            "display": 1,
            "likes": 1207,
            "create_time": "2021-11-18T09:32:49.000Z"
        },
        {
            "id": 37,
            "content": "盛宣怀的善举值得大家学习！",
            "display": 1,
            "likes": 1844,
            "create_time": "2021-11-18T09:33:50.000Z"
        },
        {
            "id": 38,
            "content": "盛宣怀是大清必不可少的人才。",
            "display": 1,
            "likes": 954,
            "create_time": "2021-11-18T09:35:01.000Z"
        },
        {
            "id": 39,
            "content": "认识盛宣怀学习盛的思想会得到很多启发。",
            "display": 1,
            "likes": 1653,
            "create_time": "2021-11-18T09:36:32.000Z"
        },
        {
            "id": 40,
            "content": "由于盛的贡献突出，由衷的称赞他为“中国实业之父”。",
            "display": 1,
            "likes": 701,
            "create_time": "2021-11-18T09:37:57.000Z"
        },
        {
            "id": 41,
            "content": "向民主革命家致敬！",
            "display": 1,
            "likes": 1617,
            "create_time": "2021-11-18T09:39:14.000Z"
        },
        {
            "id": 42,
            "content": "中国当代一位纯粹的商人！",
            "display": 1,
            "likes": 916,
            "create_time": "2021-11-18T09:42:07.000Z"
        },
        {
            "id": 43,
            "content": "盛宣怀的行为推动了时代的发展。",
            "display": 1,
            "likes": 1758,
            "create_time": "2021-11-18T09:44:07.000Z"
        },
        {
            "id": 44,
            "content": "感谢他为中国早期民族工业做出了巨大贡献。",
            "display": 1,
            "likes": 1112,
            "create_time": "2021-11-18T09:44:45.000Z"
        },
        {
            "id": 45,
            "content": "我们要学习盛宣怀的励志精神！",
            "display": 1,
            "likes": 714,
            "create_time": "2021-11-18T09:45:54.000Z"
        },
        {
            "id": 46,
            "content": "我们不得不学习他的实业教育思想。",
            "display": 1,
            "likes": 1485,
            "create_time": "2021-11-18T09:46:25.000Z"
        },
        {
            "id": 47,
            "content": "他的商业思想来源广泛，很值得我们研究。",
            "display": 1,
            "likes": 1418,
            "create_time": "2021-11-18T09:47:11.000Z"
        },
        {
            "id": 48,
            "content": "盛宣怀是常州的骄傲。",
            "display": 1,
            "likes": 1728,
            "create_time": "2021-11-18T09:48:45.000Z"
        },
        {
            "id": 49,
            "content": "盛宣怀乃一位奇人！",
            "display": 1,
            "likes": 1012,
            "create_time": "2021-11-18T09:49:12.000Z"
        },
        {
            "id": 50,
            "content": "向中国第一代实业家致敬！",
            "display": 1,
            "likes": 1326,
            "create_time": "2021-11-18T09:51:31.000Z"
        },
        {
            "id": 51,
            "content": "盛宣怀创造了中国历史上许多个第一！",
            "display": 1,
            "likes": 596,
            "create_time": "2021-11-18T09:52:20.000Z"
        }
    ]
}

// 点赞
export const giveCommit = (id) => {
  return axios({
    method: 'POST',
    url: 'sxh/comment/give',
    data: {
      id
    }
  });
}
